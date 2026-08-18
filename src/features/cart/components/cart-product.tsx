'use client';

import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';
import type { CartItem } from '@/features/cart/domain';
import { useCartActions } from '@/features/cart/hooks/use-cart-actions';

export type CartProductProps = {
  item: CartItem;
};

export function CartProduct({ item }: CartProductProps) {
  const { product, quantity } = item;
  const { changeQuantity, removeItem } = useCartActions();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    void changeQuantity(product.id, newQuantity);
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative size-22 flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-1 justify-between sm:items-center">
        <div className="flex-1 space-y-2">
          <h2 className="font-medium leading-tight line-clamp-3">
            {product.name}
          </h2>
          <p className="text-sm">#{product.id}</p>
        </div>

        <div className="flex items-center justify-between sm:gap-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-circle"
              onClick={() => handleQuantityChange(quantity - 1)}
              className="size-8"
              disabled={quantity === 1}
            >
              <Minus />
            </Button>

            <div className="w-10 h-8 border rounded flex items-center justify-center">
              <span className="text-sm font-medium">{quantity}</span>
            </div>

            <Button
              variant="ghost"
              size="icon-circle"
              onClick={() => handleQuantityChange(quantity + 1)}
              className="size-8"
            >
              <Plus />
            </Button>
          </div>

          <div className="font-medium text-xl min-w-16">
            ${item.getSubtotal().toLocaleString()}
          </div>

          <Button
            variant="ghost"
            size="icon-circle"
            onClick={() => void removeItem(product.id)}
            className="size-8"
          >
            <X />
          </Button>
        </div>
      </div>
    </div>
  );
}
