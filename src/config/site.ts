// Single source of truth for site-wide constants.

export const COMPANY_NAME = 'Magland Books';
export const COMPANY_TAGLINE = 'Stories That Spark Faith, Laughter, and Adventure';
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://maglandbooks.com';
export const FOUNDING_YEAR = '2024';

// Browser theme color (used in <meta name="theme-color"> via viewport export).
// Mirrors --color-cream from globals.css; kept here so layout.tsx doesn't need a hex literal.
export const THEME_COLOR = '#FFF9F5';

// Honeypot field names — different per form so a single bot script can't paint all forms with one decoy.
export const HONEYPOT = {
  newsletter: 'website',
  contact: 'website_url',
} as const;

// Public location (used for org schema, shipping copy)
export const LOCATION = {
  city: 'Idaho',
  region: '',
  regionFull: 'Idaho',
  country: 'US',
  display: 'Idaho',
} as const;

// Social links
export const SOCIAL = {
  facebook: 'https://www.facebook.com/maglandbooks',
  instagram: 'https://www.instagram.com/maglandbooks',
} as const;

// Contact
export const CONTACT_EMAIL = 'hello@maglandbooks.com';

// Where contact-form ("Drop us a line") submissions are sent.
// Real human reads every one — see /write-to-us hero copy.
export const CONTACT_NOTIFY_EMAIL = 'summer@maglandbooks.com';

// From: header on outgoing transactional mail (contact-form notifications).
// Must match a verified Resend sender identity on the maglandbooks.com domain.
export const CONTACT_FROM_EMAIL = 'Magland Books <hello@maglandbooks.com>';

// Routes — surfaced for nav, footer, sitemap
export const ROUTES = {
  home: '/',
  bookshelf: '/bookshelf',
  book: (slug: string) => `/bookshelf/${slug}`,
  ourFamily: '/our-family',
  publishing: '/publishing',
  letters: '/letters',
  writeToUs: '/write-to-us',
  activities: '/activities',
  privacy: '/privacy',
  storePolicy: '/store-policy',
  shippingReturns: '/shipping-returns',
  cart: '/cart',
  checkout: '/checkout',
  checkoutSuccess: '/checkout/success',
} as const;

// Primary nav (flat, no submenus — see plan IA section)
export const PRIMARY_NAV = [
  { label: 'Bookshelf', href: ROUTES.bookshelf },
  { label: 'Our Family', href: ROUTES.ourFamily },
  { label: 'Publishing', href: ROUTES.publishing },
  { label: 'Letters', href: ROUTES.letters },
  { label: 'Write to Us', href: ROUTES.writeToUs },
] as const;

// SEO defaults — per-page generateMetadata can override
export const SEO = {
  defaultTitle: `${COMPANY_NAME} — ${COMPANY_TAGLINE}`,
  defaultDescription:
    'Picture books made by family, for families. Hardcover stories rooted in courage, kindness, trust, and the quiet strength that comes from faith. Ages 4–8.',
  shortDescription:
    'Picture books made by family, for families. Stories rooted in faith, laughter, and adventure.',
  orgDescription:
    'Magland Books is a small family-run publisher of children\'s faith-based picture books. Hardcover, hand-illustrated by Kaitlyn Phillips, shipped from our home in Idaho.',
  keywords: [
    'children\'s picture books',
    'faith-based picture books',
    'Christian children\'s books',
    'family-friendly picture books',
    'hardcover picture books',
    'picture books ages 4-8',
    'read-aloud books',
    'watercolor children\'s books',
    'Mags and MarMar',
    'Pirate Flu',
    'independent children\'s publisher',
  ],
} as const;
