import { BOOKS, formatPrice, getBookBySlug } from '@/config/catalog';

describe('catalog', () => {
  it('has exactly 2 books', () => {
    expect(BOOKS).toHaveLength(2);
  });

  it('every book has the required fields', () => {
    for (const book of BOOKS) {
      expect(book.id).toBeTruthy();
      expect(book.slug).toBeTruthy();
      expect(book.title).toBeTruthy();
      expect(book.priceCents).toBeGreaterThan(0);
      expect(book.coverImage).toMatch(/^\/assets\//);
      expect(book.coverAlt.length).toBeGreaterThan(20);
    }
  });

  it('slugs are unique', () => {
    const slugs = BOOKS.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('getBookBySlug finds a book', () => {
    expect(getBookBySlug('pirate-flu')?.title).toBe('Pirate Flu');
  });

  it('getBookBySlug returns undefined for unknown slug', () => {
    expect(getBookBySlug('not-a-real-book')).toBeUndefined();
  });

  it('formatPrice renders dollars and cents', () => {
    expect(formatPrice(1499)).toBe('$14.99');
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(2500)).toBe('$25.00');
  });
});
