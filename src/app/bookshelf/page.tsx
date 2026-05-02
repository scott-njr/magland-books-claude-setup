import type { Metadata } from 'next';
import { BookCard } from '@/components/BookCard';
import { BOOKS } from '@/config/catalog';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'The Bookshelf',
  description:
    'Every Magland Books title in one place. Hardcover picture books for ages 4–8, hand-illustrated by Kaitlyn Phillips and shipped from our home in Idaho.',
  alternates: { canonical: '/bookshelf' },
};

export default function BookshelfPage() {
  return (
    <section className={`${ui.surface.cream} ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
      <div className="mx-auto max-w-[1180px]">
        <header className="text-center mb-14 sm:mb-20">
          <div className={`${ui.text.tag} mb-3`}>the bookshelf</div>
          <h1 className={`${ui.text.h1} max-w-[760px] mx-auto mb-5`}>
            Every Magland title, <em className="italic text-rose">in one place.</em>
          </h1>
          <p className="font-body text-taupe text-[1.1rem] font-light max-w-[560px] mx-auto leading-[1.65]">
            A small list, growing carefully. Each one chosen, edited, and bound by us, with art by
            Kaitlyn Phillips.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 list-none max-w-[760px] mx-auto">
          {BOOKS.map((book) => (
            <li key={book.id}>
              <BookCard book={book} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
