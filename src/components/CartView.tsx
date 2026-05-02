'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { BOOKS, formatPrice, getBookBySlug } from '@/config/catalog';
import { CART_COPY } from '@/config/messages';
import { ROUTES } from '@/config/site';
import { ui } from '@/config/ui';

export function CartView() {
  const { items, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="font-script text-rose text-[1.7rem] mb-2">your bag is empty</div>
        <p className="font-body text-warm font-light mb-7 max-w-[420px] mx-auto">
          {CART_COPY.empty} Find a book on the bookshelf and we&apos;ll put it on the way to you.
        </p>
        <Link
          href={ROUTES.bookshelf}
          className={`${ui.button.base} ${ui.button.primary} ${ui.button.sizes.md}`}
        >
          Browse the bookshelf →
        </Link>
      </div>
    );
  }

  const subtotalCents = items.reduce((sum, line) => {
    const book = getBookBySlug(line.slug);
    return sum + (book ? book.priceCents * line.quantity : 0);
  }, 0);

  return (
    <div>
      <ul className="space-y-6 list-none">
        {items.map((line) => {
          const book = BOOKS.find((b) => b.id === line.bookId);
          if (!book) return null;
          return (
            <li
              key={line.bookId}
              className="flex gap-4 sm:gap-6 items-center border-b border-[color:var(--rule)] pb-6"
            >
              <Link
                href={ROUTES.book(book.slug)}
                className="shrink-0"
                aria-label={`View ${book.title}`}
              >
                <Image
                  src={book.coverImage}
                  alt={book.coverAlt}
                  width={120}
                  height={120}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md shadow-[var(--shadow-cover)]"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={ROUTES.book(book.slug)}
                  className="font-display font-semibold text-teal-deep hover:text-teal text-lg leading-tight block"
                >
                  {book.title}
                </Link>
                {book.subtitle && (
                  <div className="font-display italic text-rose text-sm">{book.subtitle}</div>
                )}
                <div className="font-display italic text-taupe text-sm mt-1">{book.byline}</div>
                <div className="flex items-center gap-3 mt-3">
                  <label htmlFor={`qty-${book.id}`} className="font-body text-xs text-taupe">
                    Quantity
                  </label>
                  <select
                    id={`qty-${book.id}`}
                    value={line.quantity}
                    onChange={(e) =>
                      updateQuantity(line.bookId, Number.parseInt(e.target.value, 10))
                    }
                    className="border border-[color:var(--rule)] rounded-md px-2 py-1 text-sm bg-paper text-warm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeItem(line.bookId)}
                    className="font-body text-xs text-rose hover:text-error underline-offset-4 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="font-display font-semibold text-teal text-lg whitespace-nowrap">
                {formatPrice(book.priceCents * line.quantity)}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 flex flex-col gap-2 items-end">
        <div className="flex items-baseline gap-3">
          <span className="font-body text-taupe">{CART_COPY.subtotal}</span>
          <span className="font-display font-semibold text-teal text-2xl">
            {formatPrice(subtotalCents)}
          </span>
        </div>
        <p className="font-display italic text-taupe text-sm">{CART_COPY.shipping}</p>
        <p className="font-display italic text-taupe text-sm">{CART_COPY.tax}</p>
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          href={ROUTES.checkout}
          className={`${ui.button.base} ${ui.button.primary} ${ui.button.sizes.lg}`}
        >
          Proceed to checkout →
        </Link>
      </div>
    </div>
  );
}
