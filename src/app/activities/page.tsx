import type { Metadata } from 'next';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Activities',
  description:
    'Free printable activities to go with each Magland Books title. Coloring sheets, conversation cards, and more — coming soon.',
  alternates: { canonical: '/activities' },
};

export default function ActivitiesPage() {
  return (
    <>
      <section className={`bg-cream ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
        <div className="mx-auto max-w-[680px] text-center">
          <div className={`${ui.text.tag} mb-3`}>free printables</div>
          <h1 className={`${ui.text.h1} mb-7`}>
            Activities are <em className="italic text-rose">coming.</em>
          </h1>
          <p className="font-display text-warm text-[1.2rem] leading-[1.7] mb-3">
            Coloring sheets, conversation cards, and read-aloud companions — designed to go with each
            of our books. Subscribe and we&apos;ll send the first one when it&apos;s ready.
          </p>
        </div>
      </section>

      <NewsletterForm
        source="activities"
        tag="be the first"
        heading={
          <>
            Subscribe and we&apos;ll send <em className="italic text-rose">the first printable</em>
            {' '}
            as soon as it&apos;s ready.
          </>
        }
        showSignOff={false}
      />
    </>
  );
}
