import { NextResponse } from 'next/server';
import { BOOKS, getBookBySlug } from '@/config/catalog';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  createOrder,
  type LineItemInput,
  type ShippingInput,
} from '@/lib/services/square';
import {
  validateAddress,
  validateEmail,
  validateName,
} from '@/lib/validation';

const MAX_BODY_BYTES = 10_000;
const MAX_LINE_QTY = 10;
const MAX_TOTAL_QTY = 10;
const RATE_LIMIT = { action: 'checkout-order', max: 10, windowSeconds: 60 };

type RawItem = { slug: unknown; quantity: unknown };
type RawShipping = {
  name: unknown;
  email: unknown;
  street: unknown;
  city: unknown;
  state: unknown;
  zip: unknown;
};

function jsonError(status: number, error: string): NextResponse {
  return NextResponse.json({ error }, { status });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRawItemArray(value: unknown): value is RawItem[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) => isObject(item) && 'slug' in item && 'quantity' in item,
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  const { allowed } = await checkRateLimit(
    RATE_LIMIT.action,
    RATE_LIMIT.max,
    RATE_LIMIT.windowSeconds,
  );
  if (!allowed) {
    return jsonError(429, 'Too many checkout attempts. Please wait a moment.');
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

  const rawItems = parsed.items;
  if (!isRawItemArray(rawItems) || rawItems.length === 0) {
    return jsonError(400, 'Items are required.');
  }
  if (rawItems.length > MAX_TOTAL_QTY) {
    return jsonError(400, `Too many distinct items (max ${MAX_TOTAL_QTY}).`);
  }

  const lineItems: LineItemInput[] = [];
  let totalQty = 0;
  for (const item of rawItems) {
    if (typeof item.slug !== 'string') {
      return jsonError(400, 'Each item must have a string slug.');
    }
    if (
      typeof item.quantity !== 'number' ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_LINE_QTY
    ) {
      return jsonError(
        400,
        `Each item quantity must be an integer between 1 and ${MAX_LINE_QTY}.`,
      );
    }
    const book = getBookBySlug(item.slug);
    if (!book) {
      return jsonError(400, `Unknown book slug: ${item.slug}`);
    }
    lineItems.push({
      slug: book.slug,
      name: book.title,
      unitPriceCents: book.priceCents,
      quantity: item.quantity,
    });
    totalQty += item.quantity;
    if (totalQty > MAX_TOTAL_QTY) {
      return jsonError(
        400,
        `Cart has too many books (max ${MAX_TOTAL_QTY} total).`,
      );
    }
  }

  // Cross-check we didn't somehow accept a slug not in BOOKS.
  if (lineItems.length === 0 || lineItems.some((li) => !BOOKS.find((b) => b.slug === li.slug))) {
    return jsonError(400, 'Invalid line items.');
  }

  const rawShipping = parsed.shipping;
  if (!isObject(rawShipping)) {
    return jsonError(400, 'Shipping is required.');
  }
  const ship = rawShipping as RawShipping;

  const name = validateName(ship.name, 'Name');
  if (!name.valid) return jsonError(400, name.error);

  const email = validateEmail(ship.email);
  if (!email.valid) return jsonError(400, email.error);

  const address = validateAddress({
    street: ship.street,
    city: ship.city,
    state: ship.state,
    zip: ship.zip,
  });
  if (!address.valid) {
    const firstError =
      address.errors.street ??
      address.errors.city ??
      address.errors.state ??
      address.errors.zip ??
      'Invalid shipping address.';
    return jsonError(400, firstError);
  }

  const shippingValidated: ShippingInput = {
    name: name.value,
    email: email.value,
    street: address.value.street,
    city: address.value.city,
    state: address.value.state,
    zip: address.value.zip,
  };

  const idempotencyKey =
    typeof parsed.idempotencyKey === 'string' && parsed.idempotencyKey.length > 0
      ? parsed.idempotencyKey.slice(0, 45)
      : crypto.randomUUID();

  const result = await createOrder({
    lineItems,
    shipping: shippingValidated,
    idempotencyKey,
  });

  if (!result.ok) {
    return jsonError(500, 'We couldn\'t create your order. Please try again.');
  }

  return NextResponse.json(
    { orderId: result.orderId, totalCents: result.totalCents },
    { status: 200 },
  );
}
