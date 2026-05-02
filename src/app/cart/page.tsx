import type { Metadata } from 'next';
import { CartView } from '@/components/CartView';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Your Bag',
  description: 'Review what\'s in your bag before checkout.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <section className={`bg-cream ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
      <div className="mx-auto max-w-[820px]">
        <div className={`${ui.text.tag} mb-3`}>your bag</div>
        <h1 className={`${ui.text.h2} mb-10`}>
          What&apos;s in <em className="italic text-rose">your bag.</em>
        </h1>

        <CartView />
      </div>
    </section>
  );
}
