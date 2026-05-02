import Image from 'next/image';
import Link from 'next/link';
import { type BookCatalogEntry, formatPrice } from '@/config/catalog';
import { ROUTES } from '@/config/site';
import { ui } from '@/config/ui';

type Props = {
  book: BookCatalogEntry;
};

export function BookCard({ book }: Props) {
  const haloClass =
    book.coverHalo === 'mint' ? ui.motif.coverGlowMint : ui.motif.coverGlowBlush;

  return (
    <Link
      href={ROUTES.book(book.slug)}
      className="group flex flex-col gap-4 rounded-md p-4 sm:p-6 transition-shadow hover:shadow-[var(--shadow-cover)]"
    >
      <div className={`${haloClass}`}>
        <Image
          src={book.coverImage}
          alt={book.coverAlt}
          width={520}
          height={520}
          sizes="(min-width: 768px) 360px, 90vw"
          className="relative z-[1] aspect-square w-full object-cover rounded-[4px] shadow-[var(--shadow-cover)] -rotate-[1.5deg] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-[1.02]"
        />
      </div>
      <div className="px-1">
        <div className={`${ui.text.tagSm} mb-1`}>{book.homepageTag}</div>
        <h3 className="font-display font-semibold text-teal-deep text-xl sm:text-2xl tracking-tight leading-tight">
          {book.title}
          {book.subtitle && (
            <em className="block italic font-normal text-rose text-[0.75em] mt-1">
              {book.subtitle}
            </em>
          )}
        </h3>
        <div className="font-display italic text-taupe text-sm mt-1">{book.byline}</div>
        <div className="flex items-center justify-between mt-4">
          <span className="font-display font-semibold text-teal text-lg">
            {formatPrice(book.priceCents)}
          </span>
          <span className="font-display italic text-teal text-sm group-hover:text-teal-deep">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
