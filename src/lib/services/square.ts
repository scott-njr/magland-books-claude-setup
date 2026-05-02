/**
 * Square service layer — typed wrappers around Square's server SDK.
 *
 * All HTTP to Square goes through this module. Routes never read SQUARE_*
 * env vars or call the SDK directly.
 *
 * SDK reference (square@^44):
 *   import { SquareClient, SquareEnvironment, WebhooksHelper } from 'square'
 *   client.orders.create({ order, idempotencyKey })       → CreateOrderResponse
 *   client.payments.create({ sourceId, amountMoney, ... }) → CreatePaymentResponse
 *   WebhooksHelper.verifySignature({ ... })               → boolean
 *
 * Money amounts are bigint values in the smallest currency unit (USD cents).
 *
 * In dev (NODE_ENV !== 'production'), missing env vars degrade gracefully —
 * the wrappers return a structured error result rather than throwing — so the
 * checkout UI can be exercised without real Square credentials.
 */

import { SquareClient, SquareEnvironment, WebhooksHelper } from 'square';
import type { Square as SquareTypes } from 'square';

/** Flat-rate shipping fee in USD cents. US-only at launch. */
export const FLAT_SHIPPING_CENTS = 500;

export type LineItemInput = {
  /** Catalog slug — also used as referenceId / line item uid for traceability. */
  slug: string;
  /** Display name — shown on Square dashboard line items. */
  name: string;
  /** Per-unit price in USD cents. */
  unitPriceCents: number;
  /** Quantity — Square accepts a string, we convert. */
  quantity: number;
};

export type ShippingInput = {
  name: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
};

export type CreateOrderOk = {
  ok: true;
  orderId: string;
  totalCents: number;
};
export type CreateOrderErr = { ok: false; reason: string };
export type CreateOrderResult = CreateOrderOk | CreateOrderErr;

export type CreatePaymentOk = {
  ok: true;
  paymentId: string;
  receiptUrl: string | null;
  status: string;
};
export type CreatePaymentErr = { ok: false; reason: string };
export type CreatePaymentResult = CreatePaymentOk | CreatePaymentErr;

type SquareConfig = {
  client: SquareClient;
  locationId: string;
};

let cachedConfig: SquareConfig | null = null;

function readEnv(name: 'SQUARE_ACCESS_TOKEN' | 'NEXT_PUBLIC_SQUARE_LOCATION_ID' | 'SQUARE_ENVIRONMENT' | 'SQUARE_WEBHOOK_SIGNATURE_KEY' | 'NEXT_PUBLIC_APP_URL'): string | undefined {
  const value = process.env[name];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Lazy-initialize the Square server client.
 *
 * Returns null in non-production when env vars are missing so dev can run
 * without credentials. Throws in production so misconfiguration fails loud.
 */
export function getSquareClient(): SquareConfig | null {
  if (cachedConfig) return cachedConfig;

  const token = readEnv('SQUARE_ACCESS_TOKEN');
  const locationId = readEnv('NEXT_PUBLIC_SQUARE_LOCATION_ID');
  const environment = readEnv('SQUARE_ENVIRONMENT') ?? 'sandbox';

  if (!token || !locationId) {
    if (isProduction()) {
      throw new Error(
        'Square is not configured: SQUARE_ACCESS_TOKEN and NEXT_PUBLIC_SQUARE_LOCATION_ID must be set.',
      );
    }
    return null;
  }

  const baseUrl =
    environment === 'production'
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox;

  const client = new SquareClient({ token, environment: baseUrl });
  cachedConfig = { client, locationId };
  return cachedConfig;
}

function buildOrderLineItems(
  lineItems: LineItemInput[],
): SquareTypes.OrderLineItem[] {
  return lineItems.map((item) => ({
    name: item.name,
    quantity: String(item.quantity),
    basePriceMoney: {
      amount: BigInt(item.unitPriceCents),
      currency: 'USD',
    },
    // Reference back to our catalog slug so we can reconcile webhooks against
    // our own catalog without depending on Square Catalog IDs (we don't use
    // Square Catalog yet — see plan, "Catalog" section).
    metadata: { slug: item.slug.slice(0, 60) },
  }));
}

function buildShippingServiceCharge(): SquareTypes.OrderServiceCharge {
  return {
    name: 'Shipping',
    amountMoney: {
      amount: BigInt(FLAT_SHIPPING_CENTS),
      currency: 'USD',
    },
    calculationPhase: 'TOTAL_PHASE',
  };
}

/**
 * Create an order in Square. Server is the price authority — callers pass
 * line items reconstructed from the catalog, not from client-sent prices.
 */
export async function createOrder(input: {
  lineItems: LineItemInput[];
  shipping: ShippingInput;
  idempotencyKey: string;
}): Promise<CreateOrderResult> {
  const config = getSquareClient();
  if (!config) {
    return { ok: false, reason: 'square-not-configured' };
  }

  const order: SquareTypes.Order = {
    locationId: config.locationId,
    referenceId: input.shipping.email.slice(0, 40),
    lineItems: buildOrderLineItems(input.lineItems),
    serviceCharges: [buildShippingServiceCharge()],
    // Tax: skipped at launch (Idaho doesn't collect sales tax on books).
    // TODO(checkout-tax): When the seller sells to other states, switch to
    // calculated tax via the Orders API `taxes` array or move to Square
    // Catalog with location-based tax rules.
    metadata: {
      ship_name: input.shipping.name.slice(0, 60),
      ship_street: input.shipping.street.slice(0, 60),
      ship_city: input.shipping.city.slice(0, 60),
      ship_state: input.shipping.state.slice(0, 60),
      ship_zip: input.shipping.zip.slice(0, 60),
    },
  };

  try {
    const response = await config.client.orders.create({
      order,
      idempotencyKey: input.idempotencyKey,
    });
    const created = response.order;
    if (!created || !created.id) {
      return { ok: false, reason: 'square-no-order-returned' };
    }
    const totalAmount = created.totalMoney?.amount;
    const totalCents =
      typeof totalAmount === 'bigint' ? Number(totalAmount) : 0;
    return { ok: true, orderId: created.id, totalCents };
  } catch (error) {
    return { ok: false, reason: extractErrorReason(error) };
  }
}

/**
 * Charge a payment source against a previously created order.
 */
export async function createPayment(input: {
  orderId: string;
  sourceId: string;
  totalCents: number;
  idempotencyKey: string;
  buyerEmail: string;
}): Promise<CreatePaymentResult> {
  const config = getSquareClient();
  if (!config) {
    return { ok: false, reason: 'square-not-configured' };
  }

  try {
    const response = await config.client.payments.create({
      sourceId: input.sourceId,
      idempotencyKey: input.idempotencyKey,
      amountMoney: {
        amount: BigInt(input.totalCents),
        currency: 'USD',
      },
      orderId: input.orderId,
      locationId: config.locationId,
      buyerEmailAddress: input.buyerEmail,
      autocomplete: true,
    });
    const payment = response.payment;
    if (!payment || !payment.id) {
      return { ok: false, reason: 'square-no-payment-returned' };
    }
    return {
      ok: true,
      paymentId: payment.id,
      receiptUrl: payment.receiptUrl ?? null,
      status: payment.status ?? 'UNKNOWN',
    };
  } catch (error) {
    return { ok: false, reason: extractErrorReason(error) };
  }
}

/**
 * Verify a Square webhook payload against the configured signature key.
 *
 * Pass the RAW request body (not a re-stringified JSON object). The HMAC is
 * computed over the bytes Square actually sent.
 */
export async function verifyWebhookSignature(input: {
  rawBody: string;
  signatureHeader: string | null;
  notificationUrl: string;
}): Promise<boolean> {
  if (!input.signatureHeader) return false;

  const signatureKey = readEnv('SQUARE_WEBHOOK_SIGNATURE_KEY');
  if (!signatureKey) {
    if (isProduction()) {
      throw new Error(
        'Square webhooks not configured: SQUARE_WEBHOOK_SIGNATURE_KEY missing.',
      );
    }
    return false;
  }

  try {
    return await WebhooksHelper.verifySignature({
      requestBody: input.rawBody,
      signatureHeader: input.signatureHeader,
      signatureKey,
      notificationUrl: input.notificationUrl,
    });
  } catch {
    return false;
  }
}

/** Best-effort extraction of a stable error reason for logs / retries. */
function extractErrorReason(error: unknown): string {
  if (error instanceof Error) {
    return `square-${error.name}:${error.message.slice(0, 120)}`;
  }
  return 'square-unknown-error';
}
