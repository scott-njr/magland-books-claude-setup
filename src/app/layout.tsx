import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Poppins, Caveat } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { COMPANY_NAME, FOUNDING_YEAR, LOCATION, SEO, SITE_URL, THEME_COLOR } from '@/config/site';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  display: 'swap',
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Cream paper — matches body background so iOS Safari address bar blends in.
  themeColor: THEME_COLOR,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO.defaultTitle,
    template: `%s | ${COMPANY_NAME}`,
  },
  description: SEO.defaultDescription,
  keywords: [...SEO.keywords],
  alternates: { canonical: '/' },
  openGraph: {
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    type: 'website',
    url: SITE_URL,
    siteName: COMPANY_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: SEO.defaultTitle,
    description: SEO.shortDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const TODAY = new Date().toISOString().split('T')[0];

  return (
    <html lang="en">
      <head>
        {/* Organization schema — Magland Books, family-run publisher */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: COMPANY_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/assets/logo.png`,
              description: SEO.orgDescription,
              foundingDate: FOUNDING_YEAR,
              address: {
                '@type': 'PostalAddress',
                addressRegion: LOCATION.regionFull,
                addressCountry: LOCATION.country,
              },
              areaServed: 'US',
              dateModified: TODAY,
            }),
          }}
        />

        {/* WebSite schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: COMPANY_NAME,
              url: SITE_URL,
              description: SEO.orgDescription,
            }),
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${poppins.variable} ${caveat.variable} antialiased min-h-screen flex flex-col`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-paper focus:border focus:border-teal focus:rounded-md focus:text-sm focus:text-teal-deep"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
