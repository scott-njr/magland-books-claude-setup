import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookDetail } from '@/components/BookDetail';
import { getBookBySlug } from '@/config/catalog';

const SLUG = 'pirate-flu';

export const metadata: Metadata = {
  title: 'Pirate Flu (And What to Do)',
  description:
    'Pirate Flu (And What to Do) — a laugh-out-loud picture book about bravery, kindness, and what to do when nothing goes right. Written by Leigh Gardener, illustrated by Kaitlyn Phillips. Hardcover, ages 4–8.',
  alternates: { canonical: `/bookshelf/${SLUG}` },
};

export default function PirateFluPage() {
  const book = getBookBySlug(SLUG);
  if (!book) notFound();
  return <BookDetail book={book} />;
}
