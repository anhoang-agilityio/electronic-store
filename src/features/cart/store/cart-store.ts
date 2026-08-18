'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartData } from '../domain';

type CartStore = {
  cartsByUserId: Record<string, CartData>;
  saveCart: (userId: string, cart: CartData) => void;
  removeCart: (userId: string) => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cartsByUserId: {},
      saveCart: (userId, cart) =>
        set((state) => ({
          cartsByUserId: {
            ...state.cartsByUserId,
            [userId]: cart,
          },
        })),
      removeCart: (userId) =>
        set((state) => {
          const cartsByUserId = { ...state.cartsByUserId };
          delete cartsByUserId[userId];
          return { cartsByUserId };
        }),
    }),
    {
      name: 'electronic-store-carts',
      partialize: ({ cartsByUserId }) => ({ cartsByUserId }),
    },
  ),
);
