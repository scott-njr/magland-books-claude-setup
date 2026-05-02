import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/CheckoutForm';
import { CheckoutOrderSummary } from '@/components/CheckoutOrderSummary';
import { ui } from '@/config/ui';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <section className={`bg-cream ${ui.layout.sectionPaddingHero} px-5 sm:px-10`}>
      <div className="mx-auto max-w-[1100px]">
        <header className="mb-10 text-center sm:text-left">
          <div className={`${ui.text.tag} mb-3 inline-block -rotate-[1.5deg]`}>just a moment</div>
          <h1 className={`${ui.text.h1}`}>
            Let&apos;s get this <em className="italic text-rose">on its way.</em>
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-12 items-start">
          <div className="order-2 lg:order-1">
            <CheckoutForm />
          </div>
          <div className="order-1 lg:order-2 lg:sticky lg:top-24">
            <CheckoutOrderSummary />
          </div>
        </div>
      </div>
    </section>
  );
}
