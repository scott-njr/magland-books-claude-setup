import type { Metadata } from 'next';
import { BookRow } from '@/components/BookRow';
import { Hero } from '@/components/Hero';
import { Mission } from '@/components/Mission';
import { NewsletterForm } from '@/components/NewsletterForm';
import { TrustRow } from '@/components/TrustRow';
import { BOOKS } from '@/config/catalog';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Magland Books — A letter from our family',
  description:
    'Picture books made by family, for families. Hardcover, watercolor-illustrated, ages 4–8. Stories rooted in faith, laughter, and adventure.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustRow />

      <section
        id="books"
        className={`${ui.surface.paper} border-t border-[color:var(--rule)] ${ui.layout.sectionPadding} px-5 sm:px-10`}
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center mb-16 sm:mb-20">
            <div className={`${ui.text.tag} mb-2`}>here&apos;s what we&apos;ve made</div>
            <h2 className={`${ui.text.h2} max-w-[720px] mx-auto mb-4`}>
              Two titles in print, <em className="italic text-rose">both ours.</em>
            </h2>
            <p className="font-body text-taupe text-[1.05rem] font-light max-w-[540px] mx-auto">
              A small list. We won&apos;t grow it carelessly — every book is chosen, edited, and
              bound by us, with art by Kaitlyn Phillips.
            </p>
          </div>

          {BOOKS.map((book, index) => (
            <BookRow
              key={book.id}
              book={book}
              align={index % 2 === 0 ? 'left' : 'right'}
              hideRule={index === 0}
            />
          ))}
        </div>
      </section>

      <Mission />
      <NewsletterForm source="home" />
    </>
  );
}
