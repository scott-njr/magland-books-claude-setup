import type { MetadataRoute } from 'next';
import { BOOKS } from '@/config/catalog';
import { ROUTES, SITE_URL } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}${ROUTES.home}`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}${ROUTES.bookshelf}`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}${ROUTES.ourFamily}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}${ROUTES.publishing}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}${ROUTES.letters}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}${ROUTES.writeToUs}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}${ROUTES.activities}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}${ROUTES.privacy}`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}${ROUTES.storePolicy}`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}${ROUTES.shippingReturns}`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const bookEntries: MetadataRoute.Sitemap = BOOKS.map((book) => ({
    url: `${SITE_URL}${ROUTES.book(book.slug)}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  return [...staticEntries, ...bookEntries];
}
