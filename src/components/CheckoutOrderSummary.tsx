'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { BOOKS, formatPrice, getBookBySlug } from '@/config/catalog';
import { CHECKOUT_COPY } from '@/config/messages';
import { ROUTES } from '@/config/site';
import { ui } from '@/config/ui';
import { FLAT_SHIPPING_CENTS } from '@/lib/services/square';

export type CheckoutTotals = {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
};

export function computeTotalsFromCart(items: { slug: string; quantity: number }[]): CheckoutTotals {
  const subtotalCents = items.reduce((sum, line) => {
    const book = getBookBySlug(line.slug);
    return sum + (book ? book.priceCents * line.quantity : 0);
  }, 0);
  const shippingCents = items.length > 0 ? FLAT_SHIPPING_CENTS : 0;
  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}

export function CheckoutOrderSummary() {
  const { items } = useCart();
  const totals = computeTotalsFromCart(items);

  if (items.length === 0) {
    return (
      <aside className={ui.card.base}>
        <div className="font-script text-rose text-[1.5rem] mb-2">{CHECKOUT_COPY.emptyBagTitle}</div>
        <p className="font-body text-warm font-light mb-5">{CHECKOUT_COPY.emptyBagBody}</p>
        <Link
          href={ROUTES.bookshelf}
          className={`${ui.button.base} ${ui.button.primary} ${ui.button.sizes.md}`}
        >
          Browse the bookshelf →
        </Link>
      </aside>
    );
  }

  return (
    <aside className={ui.card.base}>
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="font-display font-semibold text-teal-deep text-xl">Your bag</h2>
        <Link
          href={ROUTES.cart}
          className="font-display italic text-teal hover:text-rose text-sm"
        >
          Edit your bag →
        </Link>
      </div>

      <ul className="space-y-4 list-none">
        {items.map((line) => {
          const book = BOOKS.find((b) => b.id === line.bookId);
          if (!book) return null;
          return (
            <li
              key={line.bookId}
              className="flex gap-3 items-center pb-4 border-b border-[color:var(--rule)]"
            >
              <Image
                src={book.coverImage}
                alt={book.coverAlt}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-md shadow-[var(--shadow-cover)]"
              />
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-teal-deep text-base leading-tight truncate">
                  {book.title}
                </div>
                <div className="font-body text-xs text-taupe mt-0.5">Qty {line.quantity}</div>
              </div>
              <div className="font-display font-semibold text-teal text-base whitespace-nowrap">
                {formatPrice(book.priceCents * line.quantity)}
              </div>
            </li>
          );
        })}
      </ul>

      <dl className="mt-5 space-y-2">
        <div className="flex items-baseline justify-between">
          <dt className="font-body text-taupe text-sm">{CHECKOUT_COPY.subtotalLabel}</dt>
          <dd className="font-display font-medium text-teal-deep">
            {formatPrice(totals.subtotalCents)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="font-body text-taupe text-sm">{CHECKOUT_COPY.shippingLabel}</dt>
          <dd className="font-display font-medium text-teal-deep">
            {formatPrice(totals.shippingCents)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between pt-2 border-t border-[color:var(--rule)]">
          <dt className="font-display font-semibold text-teal-deep text-lg">
            {CHECKOUT_COPY.totalLabel}
          </dt>
          <dd className="font-display font-semibold text-teal text-2xl">
            {formatPrice(totals.totalCents)}
          </dd>
        </div>
      </dl>

      <p className="mt-5 font-display italic text-taupe text-sm">{CHECKOUT_COPY.flatShipping}</p>
    </aside>
  );
}
