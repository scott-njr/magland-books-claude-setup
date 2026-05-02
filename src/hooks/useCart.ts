'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { CartLineItem } from '@/types';

const STORAGE_KEY = 'magland.cart.v1';
const CART_UPDATE_EVENT = 'magland:cart-update';
const MAX_QUANTITY_PER_ITEM = 10;

function readCart(): CartLineItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidLineItem);
  } catch {
    return [];
  }
}

function isValidLineItem(value: unknown): value is CartLineItem {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.bookId === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.quantity === 'number' &&
    obj.quantity > 0
  );
}

function writeCart(items: CartLineItem[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT));
}

let cachedSnapshot: CartLineItem[] = [];
let cachedKey = '';

function getSnapshot(): CartLineItem[] {
  if (typeof window === 'undefined') return cachedSnapshot;
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? '';
  if (raw === cachedKey) return cachedSnapshot;
  cachedKey = raw;
  cachedSnapshot = readCart();
  return cachedSnapshot;
}

const EMPTY_SNAPSHOT: CartLineItem[] = [];
function getServerSnapshot(): CartLineItem[] {
  return EMPTY_SNAPSHOT;
}

function subscribe(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CART_UPDATE_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(CART_UPDATE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((bookId: string, slug: string) => {
    const current = readCart();
    const existing = current.find((line) => line.bookId === bookId);
    let next: CartLineItem[];
    if (existing) {
      next = current.map((line) =>
        line.bookId === bookId
          ? {
              ...line,
              quantity: Math.min(line.quantity + 1, MAX_QUANTITY_PER_ITEM),
            }
          : line,
      );
    } else {
      next = [...current, { bookId, slug, quantity: 1 }];
    }
    writeCart(next);
  }, []);

  const removeItem = useCallback((bookId: string) => {
    const next = readCart().filter((line) => line.bookId !== bookId);
    writeCart(next);
  }, []);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    if (quantity <= 0) {
      const next = readCart().filter((line) => line.bookId !== bookId);
      writeCart(next);
      return;
    }
    const clamped = Math.min(quantity, MAX_QUANTITY_PER_ITEM);
    const next = readCart().map((line) =>
      line.bookId === bookId ? { ...line, quantity: clamped } : line,
    );
    writeCart(next);
  }, []);

  const clear = useCallback(() => {
    writeCart([]);
  }, []);

  const totalQuantity = items.reduce((sum, line) => sum + line.quantity, 0);

  return {
    items,
    totalQuantity,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };
}
