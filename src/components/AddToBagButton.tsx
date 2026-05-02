'use client';

import { useState } from 'react';
import { ArrowRight } from '@/components/icons/ArrowRight';
import { Check } from '@/components/icons/Check';
import { useCart } from '@/hooks/useCart';
import { ui } from '@/config/ui';

type Props = {
  bookId: string;
  slug: string;
  bookTitle: string;
};

export function AddToBagButton({ bookId, slug, bookTitle }: Props) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = () => {
    addItem(bookId, slug);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Add ${bookTitle} to bag`}
      className={`${ui.button.base} ${ui.button.primary} ${ui.button.sizes.md} gap-2`}
    >
      {justAdded ? (
        <>
          Added <Check size={16} />
        </>
      ) : (
        <>
          Add to bag <ArrowRight size={14} />
        </>
      )}
    </button>
  );
}
