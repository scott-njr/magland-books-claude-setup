import Image from 'next/image';
import Link from 'next/link';
import { AddToBagButton } from '@/components/AddToBagButton';
import { type BookCatalogEntry, formatPrice } from '@/config/catalog';
import { CART_COPY } from '@/config/messages';
import { ROUTES } from '@/config/site';
import { ui } from '@/config/ui';

type Props = {
  book: BookCatalogEntry;
  /** Cover side. 'left' = cover left + info right; 'right' = cover right + info left. */
  align?: 'left' | 'right';
  /** Hide the top divider — used on the first row of a section. */
  hideRule?: boolean;
};

export function BookRow({ book, align = 'left', hideRule = false }: Props) {
  const haloClass =
    book.coverHalo === 'mint' ? ui.motif.coverGlowMint : ui.motif.coverGlowBlush;
  const rotation = align === 'right' ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]';
  const coverOrder = align === 'right' ? 'lg:order-2' : 'lg:order-1';
  const infoOrder = align === 'right' ? 'lg:order-1' : 'lg:order-2';

  return (
    <article
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center py-14 ${
        hideRule ? '' : 'border-t border-[color:var(--rule)]'
      }`}
    >
      <div className={`${haloClass} ${coverOrder}`}>
        <Image
          src={book.coverImage}
          alt={book.coverAlt}
          width={780}
          height={780}
          sizes="(min-width: 1024px) 540px, 92vw"
          className={`relative z-[1] w-[92%] aspect-square object-cover rounded-[4px] shadow-[var(--shadow-cover)] ${rotation} transition-transform duration-300 hover:rotate-0 hover:scale-[1.02]`}
        />
      </div>

      <div className={infoOrder}>
        <div className={`${ui.text.tagSm} mb-1.5`}>{book.homepageTag}</div>
        <h3 className={ui.text.h3}>
          {book.title}
          {book.subtitle && (
            <em className="block italic font-normal text-rose text-[0.7em] mt-1">
              {book.subtitle}
            </em>
          )}
        </h3>
        <div className="font-display italic text-taupe text-base mt-1 mb-5">
          {book.byline}
        </div>
        <p className="font-body text-warm text-[1.05rem] font-light leading-[1.7] max-w-[460px] mb-7">
          {book.shortDescription}
        </p>
        <div className="flex flex-wrap gap-3 mb-6">
          <span className={ui.text.metaPill}>Picture book</span>
          <span className={ui.text.metaPill}>{book.ageRange}</span>
          <span className={ui.text.metaPill}>{book.pageCount} pages</span>
          <span className={ui.text.metaPill}>{book.format}</span>
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <span className={ui.text.price}>{formatPrice(book.priceCents)}</span>
          <AddToBagButton bookId={book.id} slug={book.slug} bookTitle={book.title} />
        </div>
        <p className="font-display italic text-taupe text-sm mt-3">
          {CART_COPY.shipsFromIdaho}
        </p>
        <Link
          href={ROUTES.book(book.slug)}
          className="inline-block mt-4 font-body text-sm text-teal hover:text-teal-deep underline-offset-4 hover:underline"
        >
          Read more about {book.title} →
        </Link>
      </div>
    </article>
  );
}
