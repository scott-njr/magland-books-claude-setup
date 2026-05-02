/**
 * UI configuration — single source of truth for component class strings.
 *
 * Visual posture (locked, see PRODUCT.md): warm watercolor letterhead.
 * Playfair Display + Poppins + Caveat. Cream paper. Teal CTAs, peach
 * accents, blush surfaces. Watercolor radial halos behind covers.
 */

export const ui = {
  layout: {
    container: 'mx-auto max-w-[1240px] px-5 sm:px-10',
    containerNarrow: 'mx-auto max-w-[760px] px-5 sm:px-10',
    containerProse: 'mx-auto max-w-[680px] px-5 sm:px-10',
    booksContainer: 'mx-auto max-w-[1180px] px-5 sm:px-10',
    sectionPadding: 'py-16 sm:py-24',
    sectionPaddingTight: 'py-12 sm:py-16',
    sectionPaddingHero: 'pt-10 pb-20 sm:pt-12 sm:pb-24',
  },

  surface: {
    cream: 'bg-cream',
    paper: 'bg-paper',
    blush: 'bg-blush',
    mint: 'bg-teal-mint',
    deepTeal: 'bg-teal-deep',
    rule: 'border-t border-[color:var(--rule)]',
  },

  text: {
    /** Big editorial headline (Playfair, medium, tight tracking) */
    h1: 'font-display font-medium tracking-tight text-teal-deep leading-[1.05] text-[clamp(2.4rem,5.5vw,4rem)]',
    h2: 'font-display font-medium tracking-tight text-teal-deep leading-[1.1] text-[clamp(2rem,4.5vw,3.2rem)]',
    h3: 'font-display font-semibold tracking-tight text-teal-deep leading-[1.1] text-[clamp(1.6rem,3vw,2.4rem)]',
    h4: 'font-display italic font-medium text-peach text-lg',

    /** Caveat handwritten tag — eyebrow above section heads */
    tag: 'font-script text-rose text-[1.6rem] sm:text-[1.7rem] leading-none',
    tagSm: 'font-script text-rose text-[1.3rem] sm:text-[1.4rem] leading-none',

    /** Body copy — Poppins light/regular */
    body: 'font-body text-base text-warm font-light leading-[1.75]',
    bodyEditorial:
      'font-display text-warm text-[1.25rem] sm:text-[1.35rem] leading-[1.6]',
    bodyMuted: 'font-body text-base text-taupe font-light leading-[1.65]',

    /** Italic Playfair for pull-quotes and microcopy */
    quote:
      'font-display italic text-teal-deep tracking-tight leading-[1.35] text-[clamp(1.6rem,3.6vw,2.6rem)]',

    /** Form helper / fine print */
    fine: 'font-display italic text-taupe text-sm',
    metaPill:
      'inline-block font-body text-xs uppercase tracking-[0.04em] font-medium text-teal bg-teal-mint px-3 py-[5px] rounded-full',
    price: 'font-display font-semibold text-teal text-2xl sm:text-[1.6rem]',
    /** Letterspaced uppercase Poppins (signature meta, footer rule) */
    overline:
      'font-body text-xs font-medium uppercase tracking-[0.18em] text-rose',
    navLink:
      'font-display italic text-[1.05rem] text-teal hover:text-teal-deep transition-colors',
  },

  button: {
    base: 'inline-flex items-center justify-center font-body font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cream disabled:opacity-50 disabled:cursor-not-allowed',
    primary: 'bg-teal text-paper hover:bg-teal-deep focus:ring-teal',
    secondary: 'bg-peach text-teal-deep hover:bg-blush focus:ring-peach',
    ghost: 'text-teal hover:text-teal-deep focus:ring-teal',
    /** "Send →"-style link button (newsletter form) */
    link: 'font-display italic text-teal hover:text-rose text-[1.1rem] font-medium bg-transparent rounded-none focus:ring-teal',
    sizes: {
      sm: 'px-4 py-2 text-sm min-h-[40px]',
      md: 'px-6 py-3 text-sm min-h-[44px]',
      lg: 'px-7 py-3.5 text-base min-h-[48px]',
    },
  },

  input: {
    /** Bordered input used on contact / cart / checkout forms */
    base: 'w-full rounded-md border border-[color:var(--rule)] bg-paper px-4 py-3 text-warm placeholder:text-rose/60 placeholder:italic placeholder:font-display focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30 transition-colors min-h-[44px]',
    /** Underline-only input used on the newsletter (variant-2 hero close) */
    underline:
      'flex-1 bg-transparent border-none text-warm font-display italic text-lg placeholder:text-rose/60 focus:outline-none py-3 px-0',
    error: 'border-error focus:border-error focus:ring-error/30',
    label: 'block font-body text-sm font-medium text-teal-deep mb-2',
  },

  textarea: {
    base: 'w-full rounded-md border border-[color:var(--rule)] bg-paper px-4 py-3 text-warm placeholder:text-rose/60 placeholder:italic placeholder:font-display focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30 transition-colors resize-y min-h-[120px]',
  },

  honeypot:
    'absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0 pointer-events-none',

  feedback: {
    success:
      'rounded-md border border-teal/30 bg-teal-mint px-4 py-4 text-teal-deep text-sm font-body',
    error:
      'rounded-md border border-error/40 bg-blush/40 px-4 py-3 text-error text-sm font-body',
    inlineError: 'mt-1 text-xs text-error font-body',
  },

  card: {
    base: 'rounded-md border border-[color:var(--rule)] bg-paper p-6 sm:p-8',
    bookCard:
      'group flex flex-col gap-4 rounded-md bg-paper p-6 transition-shadow hover:shadow-[var(--shadow-cover)]',
  },

  // Decorative motifs
  motif: {
    /** Cream paper hero with watercolor radials. Wrap with this + className `bg-letter`. */
    letterSection:
      'relative overflow-hidden bg-cream',
    /** Mission block — blush background, giant decorative quote (CSS-driven). */
    missionSection:
      'relative overflow-hidden bg-blush',
    /** Cover halo wrappers */
    coverGlowBlush:
      'cover-glow-blush relative flex items-center justify-center',
    coverGlowMint:
      'cover-glow-mint relative flex items-center justify-center',
  },
} as const;
