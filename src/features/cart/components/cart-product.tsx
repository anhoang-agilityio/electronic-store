'use client';

import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/user-store';
import type { CartItem } from '@/types/store';

export type CartProductProps = {
  product: CartItem['product'];
  quantity: number;
};

export function CartProduct({ product, quantity }: CartProductProps) {
  const updateCartItemQuantity = useUserStore((s) => s.updateCartItemQuantity);
  const removeFromCart = useUserStore((s) => s.removeFromCart);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(product.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="flex items-center gap-4 py-4">
      {/* Product Image */}
      <div className="relative size-22 flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-max justify-between sm:items-center">
        {/* Product Info */}
        <div className="flex-1 space-y-2">
          <h2 className="font-medium leading-tight line-clamp-3">
            {product.name}
          </h2>
          <p className="text-sm">#{product.id}</p>
        </div>

        {/* Counter, Price, Remove */}
        <div className="flex items-center justify-between gap-6">
          {/* Quantity Counter */}
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

          {/* Price */}
          <div className="font-medium text-xl min-w-16 text-right">
            ${(product.price * quantity).toLocaleString()}
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon-circle"
            onClick={handleRemove}
            className="size-8"
          >
            <X />
          </Button>
        </div>
      </div>
    </div>
  );
}
