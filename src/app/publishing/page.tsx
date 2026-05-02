import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@/config/site';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Publishing Services',
  description:
    'Hybrid publishing partnerships and customizable services for self-publishing authors. Story branding, launch packets, editing, and design — from a small family-run publisher.',
  alternates: { canonical: '/publishing' },
};

const HYBRID_BULLETS = [
  'Author brand identity and style guide with current market analysis',
  'Custom author website (built and hosted)',
  'Social media strategy and content creation',
  'In-person and online book launch campaigns and strategies',
  'Email marketing setup and launch series',
  'Public relations, press outreach, and faith community reach',
  'Wholesale and retail placement outreach',
  'Editing and design services',
] as const;

const PACKAGES = [
  {
    title: 'Story Branding & Marketing Package',
    price: 'Starting at $350',
    bullets: [
      'Brand and customer-retention audit; website and SEO analysis with recommendations and tailored deliverables to market your work',
      'Website built to your brand (additional fee)',
    ],
  },
  {
    title: 'Launch Packet',
    price: 'Starting at $250',
    bullets: [
      'Launch party full campaign (online or in-person), 8 weeks in advance',
      'Budget sheet',
      'Content calendar and schedule',
    ],
  },
  {
    title: 'Editing & Design Packet',
    price: 'Starting at $250',
    bullets: [
      'Text editing for grammar, syntax, and rhyming meter',
      'Design edit and recommendations',
    ],
  },
] as const;

export default function PublishingPage() {
  return (
    <>
      <section className={`bg-cream ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
        <div className="mx-auto max-w-[820px]">
          <div className={`${ui.text.tag} mb-3`}>publishing services</div>
          <h1 className={`${ui.text.h1} mb-6`}>
            Hybrid publishing,{' '}
            <em className="italic text-rose">on a small list.</em>
          </h1>
          <p className="font-body text-warm text-[1.15rem] font-light leading-[1.75] max-w-[660px]">
            At Magland Books, we take care in meticulously selecting authors whose works reflect and
            resonate with our core values and mission. We accept a limited number of publishing
            partners and projects each year.
          </p>
        </div>
      </section>

      <section className="bg-paper border-t border-[color:var(--rule)] py-16 sm:py-20 px-5 sm:px-10">
        <div className="mx-auto max-w-[820px]">
          <h2 className={`${ui.text.h3} mb-6`}>
            What a publishing partnership looks like
          </h2>
          <ul className="space-y-3 list-disc pl-5 marker:text-rose">
            {HYBRID_BULLETS.map((bullet) => (
              <li key={bullet} className="font-body text-warm text-[1.05rem] font-light leading-[1.7]">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${ui.motif.missionSection} py-16 sm:py-20 px-5 sm:px-10`}>
        <div className="relative z-10 mx-auto max-w-[820px]">
          <div className={`${ui.text.tag} mb-3`}>customizable services</div>
          <h2 className={`${ui.text.h3} mb-5`}>
            For self-publishers who need <em className="italic text-rose">a little extra boost.</em>
          </h2>
          <p className="font-body text-warm text-[1.05rem] font-light leading-[1.75] max-w-[640px] mb-10">
            These services are for self-publishers who don&apos;t want to commit to a publishing
            company. Authors can pay for select services to help grow their audience and produce
            excellent books.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <article
                key={pkg.title}
                className="bg-paper rounded-md p-6 sm:p-7 border border-[color:var(--rule)]"
              >
                <h3 className="font-display font-semibold text-teal-deep text-xl leading-tight mb-2">
                  {pkg.title}
                </h3>
                <div className="font-display italic text-rose mb-4">{pkg.price}</div>
                <ul className="space-y-2 list-disc pl-5 marker:text-rose">
                  {pkg.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="font-body text-warm font-light text-[0.95rem] leading-[1.65]"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream border-t border-[color:var(--rule)] py-16 sm:py-20 px-5 sm:px-10">
        <div className="mx-auto max-w-[680px] text-center">
          <div className={`${ui.text.tag} mb-3`}>ready to tell your story?</div>
          <h2 className={`${ui.text.h2} mb-5`}>
            Tell us about <em className="italic text-rose">what you&apos;re writing.</em>
          </h2>
          <p className="font-body text-taupe text-[1.05rem] font-light leading-[1.65] mb-8">
            Applications are reviewed personally by the Magland Books team. We accept a limited
            number of publishing partners each year — and we&apos;d love to hear about yours.
          </p>
          <Link
            href={ROUTES.writeToUs}
            className={`${ui.button.base} ${ui.button.primary} ${ui.button.sizes.lg}`}
          >
            Write to us →
          </Link>
        </div>
      </section>
    </>
  );
}
