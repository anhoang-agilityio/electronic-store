'use client';

import { Schema } from 'effect';
import * as React from 'react';

import { useCurrentUserId } from '@/features/session/hooks/use-current-user-id';

import { Cart } from '../domain';
import { useCartStore } from '../store/cart-store';

const EMPTY_CART = Cart.empty();

export function useCart(userId: string | null): Cart {
  const encodedCart = useCartStore((state) =>
    userId ? state.cartsByUserId[userId] : undefined,
  );

  return React.useMemo(
    () =>
      encodedCart ? Schema.decodeUnknownSync(Cart)(encodedCart) : EMPTY_CART,
    [encodedCart],
  );
}

export function useCurrentCart(): Cart {
  const userId = useCurrentUserId();
  return useCart(userId);
}
