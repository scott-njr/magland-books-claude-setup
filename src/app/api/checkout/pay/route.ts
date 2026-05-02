import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { createPayment } from '@/lib/services/square';
import { validateEmail } from '@/lib/validation';

const MAX_BODY_BYTES = 4_000;
const RATE_LIMIT = { action: 'checkout-pay', max: 5, windowSeconds: 60 };
const MAX_TOTAL_CENTS = 1_000_000; // $10,000 — sanity ceiling, books are $15 each.

function jsonError(status: number, error: string): NextResponse {
  return NextResponse.json({ error }, { status });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export async function POST(request: Request): Promise<NextResponse> {
  const { allowed } = await checkRateLimit(
    RATE_LIMIT.action,
    RATE_LIMIT.max,
    RATE_LIMIT.windowSeconds,
  );
  if (!allowed) {
    return jsonError(429, 'Too many payment attempts. Please wait a moment.');
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return jsonError(415, 'Content-Type must be application/json.');
  }

  const lengthHeader = request.headers.get('content-length');
  if (lengthHeader && Number.parseInt(lengthHeader, 10) > MAX_BODY_BYTES) {
    return jsonError(413, 'Request too large.');
  }

  let parsed: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return jsonError(413, 'Request too large.');
    }
    parsed = JSON.parse(text);
  } catch {
    return jsonError(400, 'Invalid JSON body.');
  }

  if (!isObject(parsed)) {
    return jsonError(400, 'Body must be a JSON object.');
  }

  if (!isNonEmptyString(parsed.orderId)) {
    return jsonError(400, 'orderId is required.');
  }
  if (!isNonEmptyString(parsed.sourceId)) {
    return jsonError(400, 'sourceId is required.');
  }
  if (!isNonEmptyString(parsed.idempotencyKey)) {
    return jsonError(400, 'idempotencyKey is required.');
  }

  const totalCents = parsed.totalCents;
  if (
    typeof totalCents !== 'number' ||
    !Number.isInteger(totalCents) ||
    totalCents <= 0 ||
    totalCents > MAX_TOTAL_CENTS
  ) {
    return jsonError(400, 'totalCents must be a positive integer in cents.');
  }

  const email = validateEmail(parsed.buyerEmail);
  if (!email.valid) return jsonError(400, email.error);

  const result = await createPayment({
    orderId: parsed.orderId,
    sourceId: parsed.sourceId,
    totalCents,
    idempotencyKey: parsed.idempotencyKey.slice(0, 45),
    buyerEmail: email.value,
  });

  if (!result.ok) {
    return jsonError(
      500,
      'We couldn\'t complete your payment. Please try again.',
    );
  }

  return NextResponse.json(
    {
      paymentId: result.paymentId,
      receiptUrl: result.receiptUrl,
      status: result.status,
    },
    { status: 200 },
  );
}
