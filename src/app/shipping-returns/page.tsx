import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL, ROUTES } from '@/config/site';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description:
    'Shipping times, costs, and return policy for Magland Books orders. Ships from Idaho in 1–2 business days.',
  alternates: { canonical: '/shipping-returns' },
};

export default function ShippingReturnsPage() {
  return (
    <article className={`bg-cream ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
      <div className="mx-auto max-w-[720px]">
        <div className={`${ui.text.tag} mb-3`}>fine print</div>
        <h1 className={`${ui.text.h2} mb-10`}>Shipping &amp; Returns</h1>

        <div className="space-y-6 font-body text-warm font-light leading-[1.75]">
          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Where we ship from
            </h2>
            <p>
              Every order ships from our home in Idaho, packed by us and on the way within 1–2
              business days.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Where we ship to
            </h2>
            <p>
              At launch we ship to the United States. We&apos;ll add international shipping when we
              can do it without surprising you with customs charges.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Returns
            </h2>
            <p>
              See our{' '}
              <Link
                href={ROUTES.storePolicy}
                className="text-teal underline-offset-4 hover:underline"
              >
                Store Policy
              </Link>{' '}
              for full return terms. Short version: unopened books may be returned within 14 days
              with the original receipt.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Damaged in transit?
            </h2>
            <p>
              Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal underline-offset-4 hover:underline">
                {CONTACT_EMAIL}
              </a>{' '}
              within 7 days of delivery and we&apos;ll send a replacement.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
