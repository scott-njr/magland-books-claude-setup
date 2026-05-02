import Image from 'next/image';
import Link from 'next/link';
import { AddToBagButton } from '@/components/AddToBagButton';
import { type BookCatalogEntry, BOOKS, formatPrice } from '@/config/catalog';
import { CART_COPY } from '@/config/messages';
import { ROUTES, SITE_URL } from '@/config/site';
import { ui } from '@/config/ui';

type Props = {
  book: BookCatalogEntry;
};

export function BookDetail({ book }: Props) {
  const haloClass =
    book.coverHalo === 'mint' ? ui.motif.coverGlowMint : ui.motif.coverGlowBlush;
  const otherBook = BOOKS.find((b) => b.id !== book.id);

  // Schema.org Book + Product so search engines can render rich results.
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Book',
        name: `${book.title}${book.subtitle ? `: ${book.subtitle}` : ''}`,
        bookFormat: 'https://schema.org/Hardcover',
        numberOfPages: book.pageCount,
        inLanguage: 'en',
        publisher: { '@type': 'Organization', name: book.publisher },
        author: { '@type': 'Person', name: book.author },
        illustrator: { '@type': 'Person', name: book.illustrator },
        image: `${SITE_URL}${book.coverImage}`,
        description: book.shortDescription,
        url: `${SITE_URL}${ROUTES.book(book.slug)}`,
        ...(book.isbn ? { isbn: book.isbn } : {}),
      },
      {
        '@type': 'Product',
        name: `${book.title}${book.subtitle ? `: ${book.subtitle}` : ''}`,
        description: book.shortDescription,
        image: `${SITE_URL}${book.coverImage}`,
        brand: { '@type': 'Brand', name: book.publisher },
        offers: {
          '@type': 'Offer',
          price: (book.priceCents / 100).toFixed(2),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}${ROUTES.book(book.slug)}`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className={`${ui.surface.cream} ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
        <div className="mx-auto max-w-[1180px]">
          <Link
            href={ROUTES.bookshelf}
            className="inline-block mb-8 font-display italic text-teal hover:text-teal-deep"
          >
            ← Back to the bookshelf
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className={haloClass}>
              <Image
                src={book.coverImage}
                alt={book.coverAlt}
                width={780}
                height={780}
                priority
                sizes="(min-width: 1024px) 540px, 92vw"
                className="relative z-[1] w-[92%] aspect-square object-cover rounded-[4px] shadow-[var(--shadow-cover)] -rotate-[1.5deg]"
              />
            </div>

            <div>
              <div className={`${ui.text.tagSm} mb-2`}>{book.homepageTag}</div>
              <h1 className={`${ui.text.h2} mb-2`}>
                {book.title}
                {book.subtitle && (
                  <em className="block italic font-normal text-rose text-[0.6em] mt-2">
                    {book.subtitle}
                  </em>
                )}
              </h1>
              <div className="font-display italic text-taupe text-base mt-1 mb-7">
                {book.byline}
              </div>
              <p className="font-body text-warm text-[1.1rem] font-light leading-[1.75] mb-8">
                {book.longDescription}
              </p>
              <div className="flex flex-wrap gap-3 mb-7">
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
            </div>
          </div>
        </div>
      </section>

      {otherBook && (
        <section className="bg-paper border-t border-[color:var(--rule)] py-16 sm:py-20 px-5 sm:px-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="text-center mb-10">
              <div className={`${ui.text.tagSm} mb-2`}>you might also like</div>
              <h2 className={`${ui.text.h3}`}>The other one we&apos;ve made.</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-center max-w-[900px] mx-auto">
              <Link
                href={ROUTES.book(otherBook.slug)}
                className={
                  otherBook.coverHalo === 'mint'
                    ? ui.motif.coverGlowMint
                    : ui.motif.coverGlowBlush
                }
              >
                <Image
                  src={otherBook.coverImage}
                  alt={otherBook.coverAlt}
                  width={520}
                  height={520}
                  sizes="(min-width: 1024px) 360px, 90vw"
                  className="relative z-[1] aspect-square w-full object-cover rounded-[4px] shadow-[var(--shadow-cover)] -rotate-[1.5deg]"
                />
              </Link>
              <div>
                <h3 className={ui.text.h3}>
                  {otherBook.title}
                  {otherBook.subtitle && (
                    <em className="block italic font-normal text-rose text-[0.7em] mt-1">
                      {otherBook.subtitle}
                    </em>
                  )}
                </h3>
                <div className="font-display italic text-taupe mt-1 mb-4">
                  {otherBook.byline}
                </div>
                <p className="font-body text-warm font-light leading-[1.7] mb-5">
                  {otherBook.shortDescription}
                </p>
                <Link
                  href={ROUTES.book(otherBook.slug)}
                  className={`${ui.button.base} ${ui.button.secondary} ${ui.button.sizes.md}`}
                >
                  Read about {otherBook.title} →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
