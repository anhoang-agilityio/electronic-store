'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AddressData } from '../domain';

type AddressStore = {
  addressesByUserId: Record<string, readonly AddressData[]>;
  saveAddresses: (userId: string, addresses: readonly AddressData[]) => void;
  removeAddresses: (userId: string) => void;
};

export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      addressesByUserId: {},
      saveAddresses: (userId, addresses) =>
        set((state) => ({
          addressesByUserId: {
            ...state.addressesByUserId,
            [userId]: addresses,
          },
        })),
      removeAddresses: (userId) =>
        set((state) => {
          const addressesByUserId = { ...state.addressesByUserId };
          delete addressesByUserId[userId];
          return { addressesByUserId };
        }),
    }),
    {
      name: 'electronic-store-addresses',
      partialize: ({ addressesByUserId }) => ({ addressesByUserId }),
    },
  ),
);
