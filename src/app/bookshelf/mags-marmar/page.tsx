import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookDetail } from '@/components/BookDetail';
import { getBookBySlug } from '@/config/catalog';

const SLUG = 'mags-marmar';

export const metadata: Metadata = {
  title: 'Mags & MarMar: The Mystery of the Gruffly Grizzly',
  description:
    'Mags & MarMar: The Mystery of the Gruffly Grizzly — an adventure about courage, curiosity, and trusting the friends you find. Story by Summer Nelson, illustrated by Kaitlyn Phillips. Hardcover, ages 4–8.',
  alternates: { canonical: `/bookshelf/${SLUG}` },
};

export default function MagsMarMarPage() {
  const book = getBookBySlug(SLUG);
  if (!book) notFound();
  return <BookDetail book={book} />;
}
