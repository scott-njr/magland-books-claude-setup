/**
 * @jest-environment node
 *
 * Tests for the /api/checkout/create-order route handler.
 *
 * The Square service is mocked. The rate-limit module is mocked to always
 * allow (so we test validation logic, not the limiter — which has its own
 * unit coverage in production work).
 *
 * Runs under the Node test environment (not jsdom) so the WHATWG Request
 * global is available for the App Router handler under test.
 */

jest.mock('@/lib/services/square', () => ({
  createOrder: jest.fn(),
  FLAT_SHIPPING_CENTS: 500,
}));

jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn().mockResolvedValue({ allowed: true, remaining: 9 }),
}));

// Apps Script mock from test-setup.ts is global, but this route doesn't use it.

import { POST } from '@/app/api/checkout/create-order/route';
import { checkRateLimit } from '@/lib/rate-limit';
import { createOrder } from '@/lib/services/square';

const mockedCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>;
const mockedRateLimit = checkRateLimit as jest.MockedFunction<typeof checkRateLimit>;

function jsonRequest(body: unknown, overrides?: { contentType?: string | null }): Request {
  const headers = new Headers();
  if (overrides?.contentType !== null) {
    headers.set('content-type', overrides?.contentType ?? 'application/json');
  }
  return new Request('http://localhost/api/checkout/create-order', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const validShipping = {
  name: 'Sam Reader',
  email: 'sam@example.com',
  street: '123 Main St',
  city: 'Rexburg',
  state: 'ID',
  zip: '83440',
};

beforeEach(() => {
  mockedCreateOrder.mockReset();
  mockedRateLimit.mockReset();
  mockedRateLimit.mockResolvedValue({ allowed: true, remaining: 9 });
});

describe('POST /api/checkout/create-order', () => {
  it('returns 429 when rate limit is exceeded', async () => {
    mockedRateLimit.mockResolvedValueOnce({ allowed: false, remaining: 0 });
    const res = await POST(jsonRequest({ items: [], shipping: validShipping }));
    expect(res.status).toBe(429);
  });

  it('returns 415 when content-type is not JSON', async () => {
    const res = await POST(
      jsonRequest({ items: [], shipping: validShipping }, { contentType: 'text/plain' }),
    );
    expect(res.status).toBe(415);
  });

  it('returns 400 on malformed JSON', async () => {
    const res = await POST(jsonRequest('{not-json'));
    expect(res.status).toBe(400);
  });

  it('returns 400 when items array is missing', async () => {
    const res = await POST(jsonRequest({ shipping: validShipping }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when items array is empty', async () => {
    const res = await POST(jsonRequest({ items: [], shipping: validShipping }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when slug does not exist in catalog', async () => {
    const res = await POST(
      jsonRequest({
        items: [{ slug: 'not-a-real-book', quantity: 1 }],
        shipping: validShipping,
      }),
    );
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error).toContain('not-a-real-book');
  });

  it('returns 400 when quantity is below 1', async () => {
    const res = await POST(
      jsonRequest({
        items: [{ slug: 'pirate-flu', quantity: 0 }],
        shipping: validShipping,
      }),
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 when quantity is above the per-line cap', async () => {
    const res = await POST(
      jsonRequest({
        items: [{ slug: 'pirate-flu', quantity: 11 }],
        shipping: validShipping,
      }),
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 when total quantity is above the cart cap', async () => {
    const res = await POST(
      jsonRequest({
        items: [
          { slug: 'pirate-flu', quantity: 9 },
          { slug: 'mags-marmar', quantity: 9 },
        ],
        shipping: validShipping,
      }),
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 when shipping is missing', async () => {
    const res = await POST(
      jsonRequest({ items: [{ slug: 'pirate-flu', quantity: 1 }] }),
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 when shipping email is invalid', async () => {
    const res = await POST(
      jsonRequest({
        items: [{ slug: 'pirate-flu', quantity: 1 }],
        shipping: { ...validShipping, email: 'nope' },
      }),
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 when ZIP is invalid', async () => {
    const res = await POST(
      jsonRequest({
        items: [{ slug: 'pirate-flu', quantity: 1 }],
        shipping: { ...validShipping, zip: 'ABCDE' },
      }),
    );
    expect(res.status).toBe(400);
  });

  it('returns 500 when square service fails', async () => {
    mockedCreateOrder.mockResolvedValueOnce({ ok: false, reason: 'square-bad-thing' });
    const res = await POST(
      jsonRequest({
        items: [{ slug: 'pirate-flu', quantity: 1 }],
        shipping: validShipping,
      }),
    );
    expect(res.status).toBe(500);
  });

  it('returns 200 with orderId + totalCents on success', async () => {
    mockedCreateOrder.mockResolvedValueOnce({
      ok: true,
      orderId: 'ord_abc123',
      totalCents: 1999,
    });

    const res = await POST(
      jsonRequest({
        items: [{ slug: 'pirate-flu', quantity: 1 }],
        shipping: validShipping,
      }),
    );

    expect(res.status).toBe(200);
    const body = (await res.json()) as { orderId: string; totalCents: number };
    expect(body.orderId).toBe('ord_abc123');
    expect(body.totalCents).toBe(1999);

    // Verify we passed the catalog price (server-authoritative), not anything
    // a client might have sent.
    expect(mockedCreateOrder).toHaveBeenCalledTimes(1);
    const args = mockedCreateOrder.mock.calls[0]?.[0];
    expect(args).toBeDefined();
    if (args) {
      expect(args.lineItems[0]?.unitPriceCents).toBe(1499);
      expect(args.lineItems[0]?.slug).toBe('pirate-flu');
      expect(args.shipping.email).toBe('sam@example.com');
    }
  });
});
