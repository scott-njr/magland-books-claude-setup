/**
 * Trust pill row — surfaces 3 substantiated facts under the hero.
 * Deliberately NOT "Trusted by 10,000 families" (anti-pattern in CLAUDE.md).
 */
const FACTS = [
  'Family-owned',
  'Hardcover',
  'Ages 4–8',
] as const;

export function TrustRow() {
  return (
    <section
      aria-label="What we make"
      className="bg-cream border-t border-[color:var(--rule)] py-6 sm:py-7 px-5 sm:px-10"
    >
      <ul className="mx-auto max-w-[1180px] flex flex-wrap justify-center items-center gap-3 sm:gap-6 list-none">
        {FACTS.map((fact, i) => (
          <li key={fact} className="flex items-center gap-3 sm:gap-6">
            <span className="font-display italic text-teal-deep text-sm sm:text-base tracking-wide">
              {fact}
            </span>
            {i < FACTS.length - 1 && (
              <span aria-hidden="true" className="text-rose/60 select-none">·</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
