'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useCart } from '@/hooks/useCart';
import { CHECKOUT_COPY } from '@/config/messages';
import { CONTACT_EMAIL, ROUTES } from '@/config/site';
import { ui } from '@/config/ui';

// ─── Square Web Payments SDK (loaded via CDN) types ─────────────────────────

type TokenizeStatus = 'OK' | 'ERROR';

type TokenResult = {
  status: TokenizeStatus;
  token?: string;
  errors?: { message?: string }[];
};

type SquareCard = {
  attach: (selector: string | HTMLElement) => Promise<void>;
  tokenize: () => Promise<TokenResult>;
  destroy?: () => Promise<void>;
};

type SquarePayments = {
  card: () => Promise<SquareCard>;
};

type SquareGlobal = {
  payments: (applicationId: string, locationId: string) => SquarePayments;
};

declare global {
  interface Window {
    Square?: SquareGlobal;
  }
}

const SDK_URL_PROD = 'https://web.squarecdn.com/v1/square.js';
const SDK_URL_SANDBOX = 'https://sandbox.web.squarecdn.com/v1/square.js';

function getSquareSdkUrl(): string {
  // The applicationId starts with `sandbox-sq0idb-` for sandbox and `sq0idp-`
  // for production. Use that to pick the SDK script URL — if we're missing
  // the env var entirely, default to sandbox so dev doesn't blow up.
  const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? '';
  if (appId.startsWith('sandbox-')) return SDK_URL_SANDBOX;
  if (appId.length > 0) return SDK_URL_PROD;
  return SDK_URL_SANDBOX;
}

type FieldErrors = Partial<Record<
  | 'name'
  | 'email'
  | 'street'
  | 'city'
  | 'state'
  | 'zip',
  string
>>;

// Read the env-driven config once at module load — these vars are baked into
// the client bundle at build time and never change at runtime, so deriving
// them in render (or once in a ref) avoids effect-time setState entirely.
const SQUARE_APP_ID = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID ?? '';
const SQUARE_LOCATION_ID = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? '';
const SQUARE_CONFIGURED = SQUARE_APP_ID.length > 0 && SQUARE_LOCATION_ID.length > 0;

const NOT_CONFIGURED_MESSAGE = `Checkout is not yet configured. Please write to us at ${CONTACT_EMAIL} to place your order.`;

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCart();

  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<SquareCard | null>(null);

  const [sdkReady, setSdkReady] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(
    SQUARE_CONFIGURED ? null : NOT_CONFIGURED_MESSAGE,
  );

  // Initialize the Square card field once the SDK script has loaded.
  useEffect(() => {
    if (!sdkReady || !SQUARE_CONFIGURED) return;
    let cancelled = false;

    const sq = window.Square;
    const container = cardContainerRef.current;
    if (!sq || !container) return;

    (async () => {
      try {
        const payments = sq.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
        const card = await payments.card();
        if (cancelled) return;
        await card.attach(container);
        if (cancelled) return;
        cardRef.current = card;
        setCardReady(true);
      } catch {
        if (!cancelled) {
          setFormError(
            'We had trouble loading the secure card field. Please refresh and try again.',
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      const card = cardRef.current;
      cardRef.current = null;
      if (card?.destroy) {
        card.destroy().catch(() => {
          /* ignore — component is unmounting */
        });
      }
    };
  }, [sdkReady]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    if (items.length === 0) {
      setFormError('Your bag is empty.');
      return;
    }
    const card = cardRef.current;
    if (!card) {
      setFormError(
        'The card field is still loading. Please wait a moment and try again.',
      );
      return;
    }

    setFormError(null);
    setFieldErrors({});
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const shipping = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      street: String(formData.get('street') ?? ''),
      city: String(formData.get('city') ?? ''),
      state: String(formData.get('state') ?? ''),
      zip: String(formData.get('zip') ?? ''),
    };

    // Tokenize the card first — if the user mistyped, we don't even need to
    // hit our own API yet.
    let token: string;
    try {
      const result = await card.tokenize();
      if (result.status !== 'OK' || !result.token) {
        setFormError(
          result.errors?.[0]?.message ?? CHECKOUT_COPY.cardError,
        );
        setSubmitting(false);
        return;
      }
      token = result.token;
    } catch {
      setFormError(CHECKOUT_COPY.cardError);
      setSubmitting(false);
      return;
    }

    // Create the order on the server (server is the price authority).
    let orderId: string;
    let totalCents: number;
    try {
      const orderResp = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((line) => ({ slug: line.slug, quantity: line.quantity })),
          shipping,
        }),
      });
      if (!orderResp.ok) {
        const body = (await orderResp.json().catch(() => null)) as { error?: string } | null;
        setFormError(body?.error ?? CHECKOUT_COPY.orderError);
        setSubmitting(false);
        return;
      }
      const data = (await orderResp.json()) as { orderId: string; totalCents: number };
      orderId = data.orderId;
      totalCents = data.totalCents;
    } catch {
      setFormError(CHECKOUT_COPY.orderError);
      setSubmitting(false);
      return;
    }

    // Charge the payment. crypto.randomUUID is available in modern browsers
    // and on the Edge runtime — Next 16 ships with it as a baseline.
    const idempotencyKey = crypto.randomUUID();
    try {
      const payResp = await fetch('/api/checkout/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          sourceId: token,
          totalCents,
          buyerEmail: shipping.email,
          idempotencyKey,
        }),
      });
      if (!payResp.ok) {
        const body = (await payResp.json().catch(() => null)) as { error?: string } | null;
        setFormError(body?.error ?? CHECKOUT_COPY.paymentError);
        setSubmitting(false);
        return;
      }
    } catch {
      setFormError(CHECKOUT_COPY.paymentError);
      setSubmitting(false);
      return;
    }

    // Success — clear the cart and redirect.
    clear();
    router.push(`${ROUTES.checkoutSuccess}?orderId=${encodeURIComponent(orderId)}`);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <Script
        src={getSquareSdkUrl()}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
        onError={() =>
          setFormError(
            'Could not load Square. Check your connection and try again.',
          )
        }
      />
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <FormSection title="Who's it from">
          <FieldRow>
            <Field
              id="ck-name"
              name="name"
              label="Your name"
              required
              autoComplete="name"
              maxLength={100}
              error={fieldErrors.name}
            />
            <Field
              id="ck-email"
              name="email"
              label="Email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              error={fieldErrors.email}
            />
          </FieldRow>
        </FormSection>

        <FormSection title="Where it ships">
          <Field
            id="ck-street"
            name="street"
            label="Street address"
            required
            autoComplete="street-address"
            maxLength={200}
            error={fieldErrors.street}
          />
          <FieldRow>
            <Field
              id="ck-city"
              name="city"
              label="City"
              required
              autoComplete="address-level2"
              maxLength={100}
              error={fieldErrors.city}
            />
            <Field
              id="ck-state"
              name="state"
              label="State"
              required
              autoComplete="address-level1"
              maxLength={50}
              placeholder="ID"
              error={fieldErrors.state}
            />
            <Field
              id="ck-zip"
              name="zip"
              label="ZIP"
              required
              autoComplete="postal-code"
              maxLength={10}
              placeholder="83440"
              error={fieldErrors.zip}
            />
          </FieldRow>
          <p className="font-display italic text-taupe text-sm">US shipping only at launch.</p>
        </FormSection>

        <FormSection title={CHECKOUT_COPY.cardFieldLabel}>
          <div
            ref={cardContainerRef}
            id="square-card-container"
            className="rounded-md border border-[color:var(--rule)] bg-paper px-4 py-3 min-h-[68px]"
            aria-label="Card details"
          />
          {!cardReady && !formError && (
            <p className="font-body text-taupe text-sm">Loading secure card field…</p>
          )}
          <p className="font-display italic text-taupe text-sm">
            {CHECKOUT_COPY.cardFieldHint}
          </p>
        </FormSection>

        {formError && (
          <div role="alert" aria-live="polite" className={ui.feedback.error}>
            {formError}
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <p className="font-display italic text-taupe text-sm">
            By placing this order, you agree to our store policy.
          </p>
          <button
            type="submit"
            disabled={submitting || !cardReady}
            className={`${ui.button.base} ${ui.button.primary} ${ui.button.sizes.lg}`}
          >
            {submitting ? CHECKOUT_COPY.placingOrder : CHECKOUT_COPY.placeOrder}
          </button>
        </div>
      </form>
    </>
  );
}

// ─── Sub-components (kept private to this file) ─────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 border-none p-0 m-0">
      <legend className="font-display font-semibold text-teal-deep text-xl mb-2">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{children}</div>;
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'email';
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  placeholder?: string;
  error?: string;
};

function Field({
  id,
  name,
  label,
  type = 'text',
  required,
  autoComplete,
  maxLength,
  placeholder,
  error,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={ui.input.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`${ui.input.base} ${error ? ui.input.error : ''}`}
        aria-invalid={error ? true : undefined}
      />
      {error && <p className={ui.feedback.inlineError}>{error}</p>}
    </div>
  );
}
