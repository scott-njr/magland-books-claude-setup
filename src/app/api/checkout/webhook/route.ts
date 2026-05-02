import { NextResponse } from 'next/server';
import { SITE_URL } from '@/config/site';
import { verifyWebhookSignature } from '@/lib/services/square';

const SIGNATURE_HEADER = 'x-square-hmacsha256-signature';
const NOTIFICATION_PATH = '/api/checkout/webhook';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function POST(request: Request): Promise<NextResponse> {
  // Read RAW body — HMAC is computed against the bytes Square sent. Do not
  // re-stringify the parsed JSON; whitespace and key order can differ.
  const rawBody = await request.text();
  const signatureHeader = request.headers.get(SIGNATURE_HEADER);

  const notificationUrl = `${SITE_URL}${NOTIFICATION_PATH}`;
  const verified = await verifyWebhookSignature({
    rawBody,
    signatureHeader,
    notificationUrl,
  });

  if (!verified) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  if (!isObject(event)) {
    return NextResponse.json({ error: 'Invalid event payload.' }, { status: 400 });
  }

  const eventType = typeof event.type === 'string' ? event.type : 'unknown';

  // TODO(checkout-webhooks): wire real handlers.
  // - On `payment.updated` (status COMPLETED): send buyer + seller confirmation
  //   emails, log the order to the Sheet (or a Square-Orders sheet tab).
  // - On `order.updated`: persist order state if we ever store orders locally.
  // - On `refund.created`: notify seller, mark the order refunded.
  // For now we just observe — Square retries on non-2xx, so we always 200 once
  // the signature is valid.
  switch (eventType) {
    case 'payment.updated':
    case 'order.updated':
    case 'refund.created':
      // Observed. Real handling is deferred to the email integration phase.
      break;
    default:
      // Unknown event type — accept it, Square will only send what we
      // subscribed to in the dashboard.
      break;
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
