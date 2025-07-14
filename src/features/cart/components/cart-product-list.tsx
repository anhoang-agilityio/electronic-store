import React from 'react';

import { CartProduct } from '@/features/cart/components/cart-product';
import type { CartItem } from '@/types/store';

type CartProductListProps = {
  cart: CartItem[];
};

export function CartProductList({ cart }: CartProductListProps) {
  return (
    <section className="flex flex-col gap-10 px-4 md:max-lg:px-16">
      <h1 className="text-2xl font-semibold">Shopping Cart</h1>
      <div className="max-h-[500px] pr-4 overflow-y-auto divide-y space-y-10 [&_>_*:not(:last-child)]:pb-8">
        {cart.map((item) => (
          <CartProduct
            key={item.product.id}
            product={item.product}
            quantity={item.quantity}
          />
        ))}
      </div>
    </section>
  );
}
