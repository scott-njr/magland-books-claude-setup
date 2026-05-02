import { ui } from '@/config/ui';

/**
 * Letter-style hero, ported from variant-2.
 * Renders the family-letter motif with handwritten greeting, drop-cap body,
 * and signature flourish. Watercolor radial halos are pure CSS (.bg-letter).
 */
export function Hero() {
  return (
    <section className={`${ui.motif.letterSection} bg-letter ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
      <div className="relative z-10 mx-auto max-w-[760px]">
        <div className="font-script text-rose text-[clamp(2.2rem,4vw,2.8rem)] leading-none mb-6 inline-block -rotate-[1.5deg]">
          Dear reader,
        </div>
        <h1 className={`${ui.text.h1} mb-9`}>
          We are <em className="italic text-rose font-medium">not a corporation.</em>
          <br />
          We are a family.
        </h1>
        <div className={ui.text.bodyEditorial}>
          <p className="drop-cap mb-6">
            We started Magland Books at our kitchen table — three of us and a stack of stories we
            wanted our own kids to grow up with. Stories that{' '}
            <em className="italic text-teal">spark faith, laughter, and adventure.</em>{' '}
            Stories rooted in courage, kindness, trust, and the quiet strength that comes from faith.
          </p>
          <p className="mb-6">
            We chose every word carefully. We chose every illustration carefully. We took our time.
            And we&apos;ll keep taking our time, because the best read-aloud at the end of a long day
            is one that the writer also believes in.
          </p>
          <p>
            If that sounds like the kind of book you want on your shelf, we&apos;d love to share what
            we&apos;ve made.
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
  );
}
