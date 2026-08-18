'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import type { Cart } from '@/features/cart/domain';
import { Checkout } from '@/features/checkout/domain';
import { useCheckoutActions } from '@/features/checkout/hooks/use-checkout-actions';

export type CartSummaryProps = {
  cart: Cart;
};

export function CartSummary({ cart }: CartSummaryProps) {
  const { startCheckout } = useCheckoutActions();
  const router = useRouter();

  const subtotal = cart.getSubtotal();
  const estimatedTax = Checkout.getEstimatedTax(subtotal);
  const total = subtotal + estimatedTax;

  const handleCheckout = () => {
    void startCheckout().then((started) => {
      if (started) router.push(paths.checkout.step1.getHref());
    });
  };

  return (
    <section className="px-4 sm:px-16 py-14 rounded-lg border border-gray-100 shadow-md">
      <h1 className="text-xl font-bold mb-10">Order Summary</h1>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated tax</span>
          <span className="font-medium">
            {estimatedTax > 0 ? `$${estimatedTax}` : '—'}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-3">
          <span>Total</span>
          <span className="text-primary">${total.toLocaleString()}</span>
        </div>
      </div>
      <Button size="xl" className="w-full mt-12" onClick={handleCheckout}>
        Checkout
      </Button>
    </section>
  );
}
