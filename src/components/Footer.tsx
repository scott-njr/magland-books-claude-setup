import Image from 'next/image';
import Link from 'next/link';
import { Facebook } from '@/components/icons/Facebook';
import { Instagram } from '@/components/icons/Instagram';
import { COMPANY_NAME, ROUTES, SOCIAL } from '@/config/site';

const FOOTER_COLUMNS = [
  {
    heading: 'The Bookshelf',
    links: [
      { label: 'All Books', href: ROUTES.bookshelf },
      { label: 'Pirate Flu', href: ROUTES.book('pirate-flu') },
      { label: 'Mags & MarMar', href: ROUTES.book('mags-marmar') },
      { label: 'Coming Soon', href: ROUTES.bookshelf },
    ],
  },
  {
    heading: 'The Family',
    links: [
      { label: 'Our Family', href: ROUTES.ourFamily },
      { label: 'Publishing', href: ROUTES.publishing },
      { label: 'Activities', href: ROUTES.activities },
      { label: 'Letters', href: ROUTES.letters },
    ],
  },
  {
    heading: 'Stay in Touch',
    links: [
      { label: 'Newsletter', href: '/#newsletter' },
      { label: 'Write to Us', href: ROUTES.writeToUs },
      { label: 'Facebook', href: SOCIAL.facebook, external: true },
      { label: 'Instagram', href: SOCIAL.instagram, external: true },
    ],
  },
  {
    heading: 'Fine Print',
    links: [
      { label: 'Privacy', href: ROUTES.privacy },
      { label: 'Store Policy', href: ROUTES.storePolicy },
      { label: 'Shipping & Returns', href: ROUTES.shippingReturns },
    ],
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-teal-deep text-blush mt-auto">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-10 pt-16 sm:pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-14 mb-10">
          <div>
            <div className="inline-block bg-paper rounded-md px-4 py-3 mb-4">
              <Image
                src="/assets/logo.png"
                alt={COMPANY_NAME}
                width={220}
                height={80}
                className="h-16 w-auto"
              />
            </div>
            <p className="font-display italic text-[0.95rem] leading-[1.65] text-blush/70 max-w-[320px] font-light">
              Picture books made by family, for families. Rooted in courage, kindness, trust, and the
              quiet strength that comes from faith.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Magland Books on Facebook"
                className="text-blush/80 hover:text-paper transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Magland Books on Instagram"
                className="text-blush/80 hover:text-paper transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.heading} aria-labelledby={`footer-${col.heading}`}>
              <h4
                id={`footer-${col.heading}`}
                className="font-display italic text-peach text-[1.1rem] font-medium mb-4"
              >
                {col.heading}
              </h4>
              <ul className="list-none space-y-2">
                {col.links.map((link) => (
                  <li key={`${col.heading}-${link.label}`}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-[0.95rem] font-light text-blush/85 hover:text-paper transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-body text-[0.95rem] font-light text-blush/85 hover:text-paper transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="pt-7 border-t border-[color:var(--rule-soft)] flex flex-wrap justify-between gap-4 font-display italic text-sm text-blush/60">
          <span>© {year} {COMPANY_NAME}, LLC. All rights reserved.</span>
          <span>Made by family · Shipped from our home to yours</span>
        </div>
      </div>
    </footer>
  );
}
