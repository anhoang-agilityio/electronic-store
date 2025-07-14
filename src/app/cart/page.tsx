'use client';

import React from 'react';

import { CartEmptyState } from '@/features/cart/components/cart-empty-state';
import { CartProductList } from '@/features/cart/components/cart-product-list';
import { CartSummary } from '@/features/cart/components/cart-summary';
import { useCurrentUserCart } from '@/stores/user-store';

export default function CartPage() {
  const cart = useCurrentUserCart();

  const isEmpty = cart.length === 0;

  return (
    <main className="py-10 sm:py-28">
      {isEmpty ? (
        <CartEmptyState />
      ) : (
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-10 lg:gap-12 lg:*:flex-[1_1_50%]">
          <CartProductList cart={cart} />
          <CartSummary cart={cart} />
        </div>
      )}
    </main>
  );
}
