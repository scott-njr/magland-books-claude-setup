import type { Metadata } from 'next';
import { Mission } from '@/components/Mission';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Our Family',
  description:
    'Magland Books is a family-run publisher of children\'s faith-based picture books. Meet the family — Summer, Leigh, and the rest of us — and read why we make what we make.',
  alternates: { canonical: '/our-family' },
};

export default function OurFamilyPage() {
  return (
    <>
      <section className={`relative overflow-hidden bg-cream bg-letter ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
        <div className="relative z-10 mx-auto max-w-[760px]">
          <div className="font-script text-rose text-[clamp(2rem,3.6vw,2.4rem)] mb-6 inline-block -rotate-[1.5deg]">
            About us — but in our own words.
          </div>
          <h1 className={`${ui.text.h1} mb-9`}>
            Made by family,{' '}
            <em className="italic text-rose font-medium">for families.</em>
          </h1>
          <div className={ui.text.bodyEditorial}>
            <p className="drop-cap mb-6">
              Magland Books started at our kitchen table — three of us with a stack of stories we
              wanted our own kids to grow up with. We are not a corporation. We are a family who
              believes deeply in the power of a{' '}
              <em className="italic text-teal">good book shared on a quiet evening.</em>
            </p>
            <p className="mb-6">
              Our books are written and edited by us, illustrated in watercolor by Kaitlyn Phillips,
              and printed on heavyweight stock so they can survive a thousand bedtimes. We chose
              every word carefully. We chose every illustration carefully. We took our time. And
              we&apos;ll keep taking our time, because the best read-aloud at the end of a long day
              is one the writer also believes in.
            </p>
            <p>
              Magland stories are rooted in values that matter — courage, kindness, trust, and the
              quiet strength that comes from faith. We&apos;re not trying to publish a thousand
              books. We&apos;re trying to make a few good ones, and put them in the right hands.
            </p>
          </div>
          <div className="mt-12 pt-8 border-t border-[color:var(--rule)] flex items-center gap-6">
            <div className="font-script text-teal text-[2.4rem] leading-tight">
              — The Magland Family
            </div>
            <div>
              <div className={ui.text.overline}>Made by family</div>
              <div className="font-display italic text-taupe text-sm mt-1">est. 2024</div>
            </div>
          </div>
        </div>
      </section>

      <Mission
        tag="what we believe"
        quote="Stories that spark faith, laughter, and adventure."
        detail="Every Magland book is shaped by the same handful of values: courage, kindness, trust, and the quiet strength that comes from faith. We don't write to a marketing segment. We write the stories we wanted to read aloud at the end of a long day."
      />
    </>
  );
}
