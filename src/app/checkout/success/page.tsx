import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@/config/site';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Thank you',
  description: 'Your order is on its way.',
  alternates: { canonical: '/checkout/success' },
  robots: { index: false, follow: false },
};

type SearchParams = { orderId?: string | string[] };

function pickOrderId(value: SearchParams['orderId']): string | null {
  if (typeof value === 'string' && value.length > 0) {
    return value.slice(0, 80);
  }
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0].slice(0, 80);
  }
  return null;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const orderId = pickOrderId(params.orderId);

  return (
    <section className={`bg-cream ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
      <div className="mx-auto max-w-[680px] text-center">
        <div className="font-script text-rose text-[clamp(2rem,3.6vw,2.4rem)] mb-4 inline-block -rotate-[1.5deg]">
          Thank you, friend.
        </div>
        <h1 className={`${ui.text.h1} mb-6`}>
          Your order is <em className="italic text-rose">on its way.</em>
        </h1>
        <p className="font-body text-warm font-light text-[1.05rem] leading-[1.65] mb-3">
          We&apos;ll send a confirmation email shortly. Books usually leave our home within 1–2
          business days, packed with care from our kitchen table.
        </p>
        {orderId && (
          <p className="font-display italic text-taupe text-sm mb-8">
            Order reference: <span className="font-body not-italic">{orderId}</span>
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={ROUTES.bookshelf}
            className={`${ui.button.base} ${ui.button.primary} ${ui.button.sizes.md}`}
          >
            Back to the bookshelf →
          </Link>
          <Link
            href={ROUTES.home}
            className={`${ui.button.base} ${ui.button.secondary} ${ui.button.sizes.md}`}
          >
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
