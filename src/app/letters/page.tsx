import type { Metadata } from 'next';
import Link from 'next/link';
import { SOCIAL } from '@/config/site';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Letters',
  description:
    'Notes from the Magland family. Activity ideas, behind-the-scenes from the studio, and stories from making books for kids.',
  alternates: { canonical: '/letters' },
};

export default function LettersPage() {
  return (
    <section className={`relative overflow-hidden bg-cream bg-letter ${ui.layout.sectionPadding} px-5 sm:px-10`}>
      <div className="relative z-10 mx-auto max-w-[680px] text-center">
        <div className="font-script text-rose text-[clamp(2rem,3.6vw,2.4rem)] mb-6 inline-block -rotate-[1.5deg]">
          Letters from the studio
        </div>
        <h1 className={`${ui.text.h1} mb-7`}>
          We&apos;re still writing the <em className="italic text-rose">first one.</em>
        </h1>
        <p className="font-display text-warm text-[1.2rem] leading-[1.7] mb-10">
          One day soon, this will be the place we share notes from the studio — printable activity
          pages, behind-the-scenes from making a book, and the occasional letter from our family to
          yours. Until then, you can find our latest on Instagram, or join the family by email.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`${ui.button.base} ${ui.button.primary} ${ui.button.sizes.md}`}
          >
            Follow on Instagram →
          </a>
          <Link
            href="/#newsletter"
            className={`${ui.button.base} ${ui.button.secondary} ${ui.button.sizes.md}`}
          >
            Join the newsletter
          </Link>
        </div>
      </div>
    </section>
  );
}
