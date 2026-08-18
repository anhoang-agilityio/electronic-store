'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CheckoutData } from '../domain';

type CheckoutStore = {
  checkoutsByUserId: Record<string, CheckoutData>;
  saveCheckout: (userId: string, checkout: CheckoutData) => void;
  removeCheckout: (userId: string) => void;
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      checkoutsByUserId: {},
      saveCheckout: (userId, checkout) =>
        set((state) => ({
          checkoutsByUserId: {
            ...state.checkoutsByUserId,
            [userId]: checkout,
          },
        })),
      removeCheckout: (userId) =>
        set((state) => {
          const checkoutsByUserId = { ...state.checkoutsByUserId };
          delete checkoutsByUserId[userId];
          return { checkoutsByUserId };
        }),
    }),
    {
      name: 'electronic-store-checkouts',
      partialize: ({ checkoutsByUserId }) => ({ checkoutsByUserId }),
    },
  ),
);
