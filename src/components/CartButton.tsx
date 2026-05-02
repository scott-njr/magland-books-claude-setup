'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { ROUTES } from '@/config/site';

export function CartButton() {
  const { totalQuantity } = useCart();

  return (
    <Link
      href={ROUTES.cart}
      className="font-body text-sm font-medium text-teal border-b-[1.5px] border-peach pb-[2px] hover:text-teal-deep transition-colors"
      aria-label={`Shopping bag, ${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`}
    >
      Bag · {totalQuantity}
    </Link>
  );
}
