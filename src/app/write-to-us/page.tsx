import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { CONTACT_EMAIL } from '@/config/site';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Write to Us',
  description:
    'Drop us a line. We read every one. Questions about a book, wholesale orders, publishing partnerships — we\'d love to hear from you.',
  alternates: { canonical: '/write-to-us' },
};

export default function WriteToUsPage() {
  return (
    <section className={`bg-cream ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
      <div className="mx-auto max-w-[680px]">
        <div className={`${ui.text.tag} mb-3`}>write to us</div>
        <h1 className={`${ui.text.h1} mb-5`}>
          Drop us a line. <em className="italic text-rose">We read every one.</em>
        </h1>
        <p className="font-body text-taupe text-[1.05rem] font-light leading-[1.65] mb-10">
          Questions about a book, wholesale orders, publishing partnerships, or just a hello — we&apos;d
          love to hear from you. Or write directly to{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-teal underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>

        <ContactForm />
      </div>
    </section>
  );
}
