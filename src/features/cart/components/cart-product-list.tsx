import React from 'react';

import { CartProduct } from '@/features/cart/components/cart-product';
import type { CartItem } from '@/features/cart/domain';

type CartProductListProps = {
  items: readonly CartItem[];
};

export function CartProductList({ items }: CartProductListProps) {
  return (
    <section className="flex flex-col gap-10 px-4 md:max-lg:px-16">
      <h1 className="text-2xl font-semibold">Shopping Cart</h1>
      <div className="max-h-[500px] pr-4 overflow-y-auto divide-y space-y-10 [&_>_*:not(:last-child)]:pb-8">
        {items.map((item) => (
          <CartProduct key={item.product.id} item={item} />
        ))}
      </div>
    </section>
  );
}
