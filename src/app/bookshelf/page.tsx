import type { Metadata } from 'next';
import Link from 'next/link';
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
    <section className={`${ui.surface.cream} ${ui.layout.sectionPadding} px-5 sm:px-10`}>
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

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 list-none">
          {BOOKS.map((book) => (
            <li key={book.id}>
              <BookCard book={book} />
            </li>
          ))}
          <li className="flex flex-col items-center justify-center text-center rounded-md border border-dashed border-rose/40 bg-blush/30 p-10 min-h-[420px]">
            <div className="font-script text-rose text-[1.7rem] mb-3">more on the way</div>
            <h3 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Coming soon
            </h3>
            <p className="font-body text-taupe font-light max-w-[260px]">
              We&apos;re writing the next one. Subscribe and we&apos;ll let you know when it&apos;s
              ready.
            </p>
            <Link
              href="/#newsletter"
              className="mt-5 font-display italic text-teal hover:text-teal-deep underline-offset-4 hover:underline"
            >
              Join the family →
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
