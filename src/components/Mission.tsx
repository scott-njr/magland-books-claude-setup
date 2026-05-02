import { ui } from '@/config/ui';

type Props = {
  /** Caveat-script eyebrow above the quote */
  tag?: string;
  quote?: string;
  detail?: string;
};

/**
 * Blush mission block with giant decorative quote-mark (CSS-driven).
 * Defaults to the home-page mission copy from variant-2.
 */
export function Mission({
  tag = 'why we do this',
  quote = 'We believe deeply in the power of a good book shared on a quiet evening.',
  detail = 'Magland stories are rooted in values that matter — courage, kindness, trust, and the quiet strength that comes from faith. We\'re not trying to publish a thousand books. We\'re trying to make a few good ones, and put them in the right hands.',
}: Props) {
  return (
    <section
      id="why"
      className={`${ui.motif.missionSection} mission-quote ${ui.layout.sectionPadding} px-5 sm:px-10`}
    >
      <div className="relative z-10 mx-auto max-w-[880px] text-center">
        <div className={`${ui.text.tag} mb-4`}>{tag}</div>
        <p className={ui.text.quote}>
          We believe deeply in the power of a{' '}
          <em className="text-rose">good book shared on a quiet evening.</em>
        </p>
        <hr className="w-[60px] h-[2px] bg-rose border-0 my-7 mx-auto" aria-hidden="true" />
        <p className="font-body text-warm text-[1.1rem] font-light max-w-[620px] mx-auto leading-[1.65]">
          {detail}
        </p>
        {/* Quote prop kept for API compatibility; default copy is rendered above. */}
        <span className="sr-only">{quote}</span>
      </div>
    </section>
  );
}
