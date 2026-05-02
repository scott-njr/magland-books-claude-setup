// Two-book catalog. Source of truth for all book data on the site.
// When migrating to Square Catalog API later, replace these with API calls
// but keep the same `BookCatalogEntry` shape so the UI doesn't change.

export type BookCatalogEntry = {
  id: string;
  slug: string;
  title: string;
  /** Optional italicized subtitle, rendered separately from the main title. */
  subtitle?: string;
  /** Display byline used in cards and detail pages. */
  byline: string;
  author: string;
  illustrator: string;
  /** Price in USD cents — use this for math; format() for display. */
  priceCents: number;
  /** Short blurb for cards and homepage rows. */
  shortDescription: string;
  /** Long blurb for the book detail page. */
  longDescription: string;
  coverImage: string;
  coverAlt: string;
  ageRange: string;
  pageCount: number;
  format: string;
  /** Caveat-script tag rendered above the title on the homepage row. */
  homepageTag: string;
  /** Watercolor halo background behind the cover. */
  coverHalo: 'blush' | 'mint';
  /** ISBN if available — null = TBD, omitted from schema. */
  isbn: string | null;
  publisher: string;
  publishedYear: string;
};

export const BOOKS: BookCatalogEntry[] = [
  {
    id: 'pirate-flu',
    slug: 'pirate-flu',
    title: 'Pirate Flu',
    subtitle: '(And What to Do)',
    byline: 'Written by Leigh Gardener · Illustrated by Kaitlyn Phillips',
    author: 'Leigh Gardener',
    illustrator: 'Kaitlyn Phillips',
    priceCents: 1499,
    shortDescription:
      'A laugh-out-loud tale of bravery, kindness, and what to do when things don\'t go quite as planned.',
    longDescription:
      'A laugh-out-loud tale of bravery, kindness, and what to do when things don\'t go quite as planned. We wrote this one for the days when nothing goes right and the read-aloud at bedtime has to do the work of putting it back together. Hand-illustrated in watercolor by Kaitlyn Phillips and printed on heavyweight stock so it can survive a thousand bedtimes.',
    coverImage: '/assets/book-pirate.jpg',
    coverAlt:
      'Pirate Flu (And What to Do) — book cover, watercolor by Kaitlyn Phillips, an ensemble of pirates with cold and flu symptoms on a sky-blue background',
    ageRange: 'Ages 4–8',
    pageCount: 32,
    format: 'Hardcover',
    homepageTag: 'our newest',
    coverHalo: 'blush',
    isbn: null,
    publisher: 'Magland Books',
    publishedYear: '2025',
  },
  {
    id: 'mags-marmar',
    slug: 'mags-marmar',
    title: 'Mags & MarMar',
    subtitle: 'The Mystery of the Gruffly Grizzly',
    byline: 'Story by Summer Nelson · Illustrated by Kaitlyn Phillips',
    author: 'Summer Nelson',
    illustrator: 'Kaitlyn Phillips',
    priceCents: 1499,
    shortDescription:
      'An adventure about courage, curiosity, and trusting the friends you find along the way.',
    longDescription:
      'An adventure about courage, curiosity, and trusting the friends you find along the way. The first book we ever made — the one that started this whole thing — about a girl, her dog, and a door she shouldn\'t have opened. Watercolor illustrations by Kaitlyn Phillips, hardcover, 32 pages. Ages 4–8.',
    coverImage: '/assets/book-grizzly.jpg',
    coverAlt:
      'Mags & MarMar: The Mystery of the Gruffly Grizzly — book cover, watercolor by Kaitlyn Phillips, a girl and her dog peeking around a door in purple and blue tones',
    ageRange: 'Ages 4–8',
    pageCount: 32,
    format: 'Hardcover',
    homepageTag: 'our first',
    coverHalo: 'mint',
    isbn: null,
    publisher: 'Magland Books',
    publishedYear: '2024',
  },
];

export function getBookBySlug(slug: string): BookCatalogEntry | undefined {
  return BOOKS.find((book) => book.slug === slug);
}

export function formatPrice(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(2)}`;
}
