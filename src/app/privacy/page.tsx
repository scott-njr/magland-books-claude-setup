import type { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/config/site';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Magland Books privacy policy. What we collect, how we use it, who we share it with, and your rights.',
  alternates: { canonical: '/privacy' },
};

const LAST_UPDATED = 'May 1, 2026';

export default function PrivacyPage() {
  return (
    <article className={`bg-cream ${ui.layout.sectionPadding} px-5 sm:px-10`}>
      <div className="mx-auto max-w-[720px]">
        <div className={`${ui.text.tag} mb-3`}>fine print</div>
        <h1 className={`${ui.text.h2} mb-3`}>Privacy Policy</h1>
        <p className="font-display italic text-taupe mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose-content space-y-6 font-body text-warm font-light leading-[1.75]">
          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">Who we are</h2>
            <p>
              Magland Books, LLC is a family-owned children&apos;s picture-book publisher. You can
              reach us anytime at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal underline-offset-4 hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              What information we collect
            </h2>
            <p className="mb-3"><strong className="text-teal-deep">Voluntarily provided:</strong></p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-rose">
              <li>Name and email for our mailing list</li>
              <li>Name, shipping address, email, and payment information for orders</li>
            </ul>
            <p className="mt-4 mb-3"><strong className="text-teal-deep">Automatically collected:</strong></p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-rose">
              <li>IP address, browser type, and device info</li>
              <li>Pages visited and time spent, via cookies and analytics</li>
            </ul>
            <p className="mt-3">You can adjust cookie settings in your browser at any time.</p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              How we use your information
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-rose">
              <li>Fulfill orders and process payments</li>
              <li>Send emails (opt-in only)</li>
              <li>Improve website content</li>
              <li>Provide customer support</li>
            </ul>
            <p className="mt-3">
              We do not use your information for any other purpose, and we do not sell it — ever.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Children&apos;s privacy
            </h2>
            <p>
              Our site targets adults — parents, educators, and wholesalers — not children under 13.
              If we ever inadvertently collect a child&apos;s data, please contact us and we&apos;ll
              delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Email marketing
            </h2>
            <p>
              All email subscriptions are voluntary and include an unsubscribe link. You can opt out
              anytime.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Third-party sharing
            </h2>
            <p>
              Your data is shared only with payment processors and shipping providers required to
              fulfill your order. We do not sell, rent, or share your data with advertisers or data
              brokers.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Data security
            </h2>
            <p>
              We use secure, encrypted connections (HTTPS) and trusted payment processors that do
              not retain full card details on our systems.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-teal-deep text-xl mb-2">
              Your rights
            </h2>
            <p>
              You can request access to, correction of, or deletion of your data at any time by
              emailing{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-teal underline-offset-4 hover:underline">
                {CONTACT_EMAIL}
              </a>
              . We respond within 30 days.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
