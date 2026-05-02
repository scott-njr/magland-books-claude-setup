import type { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/config/site';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Store Policy',
  description:
    'Returns, damaged orders, and wholesale inquiries for Magland Books. Made by family, shipped from Idaho.',
  alternates: { canonical: '/store-policy' },
};

export default function StorePolicyPage() {
  return (
    <article className={`bg-cream ${ui.layout.sectionPadding} px-5 sm:px-10`}>
      <div className="mx-auto max-w-[720px]">
        <div className={`${ui.text.tag} mb-3`}>fine print</div>
        <h1 className={`${ui.text.h2} mb-10`}>Store Policy</h1>

        <div className="space-y-6 font-body text-warm font-light leading-[1.75]">
          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">Returns</h2>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-rose">
              <li>Return new books unopened and in their original condition.</li>
              <li>
                All returns must be made within 14 days of purchase and accompanied by an original
                sales receipt.
              </li>
              <li>The customer is responsible for return shipping expenses.</li>
              <li>Certain promotional items are excluded from returns.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Damaged orders
            </h2>
            <p>
              If your order arrives damaged, please contact us within 7 days of delivery and
              we&apos;ll send a replacement. Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal underline-offset-4 hover:underline">
                {CONTACT_EMAIL}
              </a>{' '}
              with a photo of the damage and we&apos;ll take it from there.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Wholesale inquiries
            </h2>
            <p>
              Schools, libraries, and bookstores — please reach out at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal underline-offset-4 hover:underline">
                {CONTACT_EMAIL}
              </a>{' '}
              for wholesale pricing and quantity orders.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Payment methods
            </h2>
            <p>
              We accept all major credit and debit cards via secure checkout. Card details are
              handled by our payment processor and never stored on our servers.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
