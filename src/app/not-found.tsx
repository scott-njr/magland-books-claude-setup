import Link from 'next/link';
import { ROUTES } from '@/config/site';
import { ui } from '@/config/ui';

export default function NotFound() {
  return (
    <section
      className={`relative overflow-hidden bg-cream bg-letter ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}
    >
      <div className="relative z-10 mx-auto max-w-[680px] text-center">
        <div className="font-script text-rose text-[clamp(2rem,3.6vw,2.4rem)] mb-4 inline-block -rotate-[1.5deg]">
          this page got lost
        </div>
        <h1 className={`${ui.text.h1} mb-6`}>
          We can&apos;t find <em className="italic text-rose">that one.</em>
        </h1>
        <p className="font-body text-warm font-light text-[1.05rem] leading-[1.65] mb-8">
          The page you&apos;re looking for has wandered off. Try the bookshelf, or head back to the
          letter on our front porch.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={ROUTES.home}
            className={`${ui.button.base} ${ui.button.primary} ${ui.button.sizes.md}`}
          >
            Back home
          </Link>
          <Link
            href={ROUTES.bookshelf}
            className={`${ui.button.base} ${ui.button.secondary} ${ui.button.sizes.md}`}
          >
            The bookshelf
          </Link>
        </div>
      </div>
    </section>
  );
}
