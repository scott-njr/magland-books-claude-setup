'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartButton } from '@/components/CartButton';
import { Menu } from '@/components/icons/Menu';
import { X } from '@/components/icons/X';
import { COMPANY_NAME, PRIMARY_NAV, ROUTES } from '@/config/site';
import { ui } from '@/config/ui';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer on Escape so it stays keyboard-accessible.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-sm border-b border-[color:var(--rule)]">
      <nav
        aria-label="Primary"
        className="mx-auto max-w-[1240px] grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-8 px-5 sm:px-10 py-5 sm:py-7"
      >
        <Link href={ROUTES.home} className="flex items-center" aria-label={`${COMPANY_NAME} — home`}>
          <Image
            src="/assets/logo.png"
            alt={COMPANY_NAME}
            width={220}
            height={72}
            className="h-14 sm:h-[72px] w-auto"
            priority
          />
        </Link>

        <ul className="hidden md:flex justify-center gap-8 lg:gap-9 list-none">
          {PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={ui.text.navLink}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 justify-self-end">
          <CartButton />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 -mr-2 text-teal hover:text-teal-deep"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Menu />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 bg-cream md:hidden flex flex-col"
        >
          <div className="flex items-center justify-between px-5 py-5 border-b border-[color:var(--rule)]">
            <Link
              href={ROUTES.home}
              onClick={() => setMobileOpen(false)}
              className="flex items-center"
              aria-label={`${COMPANY_NAME} — home`}
            >
              <Image
                src="/assets/logo.png"
                alt={COMPANY_NAME}
                width={180}
                height={56}
                className="h-12 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 -mr-2 text-teal hover:text-teal-deep"
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>

          <ul className="flex flex-col gap-2 px-5 py-8 list-none">
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block font-display italic text-[1.6rem] text-teal-deep py-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-6">
              <Link
                href={ROUTES.cart}
                onClick={() => setMobileOpen(false)}
                className="font-script text-rose text-[1.6rem]"
              >
                View bag →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
