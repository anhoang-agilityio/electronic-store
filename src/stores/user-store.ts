'use client';

import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  Address,
  CartItem,
  CreditCardInfo,
  ShipmentInfo,
  UserData,
} from '@/types/store';

type UserStore = {
  // State
  userData: Record<string, UserData>;
  currentUserId: string | null;

  // Actions
  setCurrentUser: (userId: string) => void;
  clearCurrentUser: () => void;

  // Cart actions
  addToCart: (
    product: { id: string; name: string; price: number; image: string },
    quantity?: number,
  ) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Address actions
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Omit<Address, 'id'>>) => void;
  removeAddress: (id: string) => void;
  clearAddresses: () => void;

  // Checkout actions
  setCheckoutProducts: (products: CartItem[]) => void;
  setCheckoutAddress: (address: Address | null) => void;
  setCheckoutShipment: (shipment: ShipmentInfo | null) => void;
  setCheckoutCreditCard: (creditCard: CreditCardInfo | null) => void;
  clearCheckout: () => void;
  clearCheckoutProducts: () => void;
  clearCheckoutAddress: () => void;
  clearCheckoutShipment: () => void;
  clearCheckoutCreditCard: () => void;

  // Utility actions
  getUserData: (userId: string) => UserData | null;
  clearUserData: (userId: string) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      userData: {},
      currentUserId: null,

      // User management
      setCurrentUser: (userId: string) => {
        set((state: UserStore) => {
          state.currentUserId = userId;
          state.userData[userId] ??= { cart: [], addresses: [] };
        });
      },

      clearCurrentUser: () => {
        set((state: UserStore) => {
          state.currentUserId = null;
        });
      },

      // Cart actions
      addToCart: (
        product: { id: string; name: string; price: number; image: string },
        quantity?: number,
      ) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        const qty = quantity ?? 1;
        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          const existingItemIndex = userData.cart.findIndex(
            (item) => item.product.id === product.id,
          );
          if (existingItemIndex >= 0) {
            userData.cart[existingItemIndex]!.quantity += qty;
          } else {
            userData.cart.push({ product, quantity: qty });
          }
        });
      },

      removeFromCart: (productId: string) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.cart = userData.cart.filter(
            (item) => item.product.id !== productId,
          );
        });
      },

      updateCartItemQuantity: (productId: string, quantity: number) => {
        const { currentUserId } = get();
        if (!currentUserId || quantity <= 0) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          const item = userData.cart.find(
            (item) => item.product.id === productId,
          );
          if (item) {
            item.quantity = quantity;
          }
        });
      },

      clearCart: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];

          if (!userData) return;
          userData.cart = [];
        });
      },

      // Address actions
      addAddress: (addressData) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        const newAddress: Address = {
          id: uuidv4(),
          ...addressData,
        };
        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.addresses.push(newAddress);
        });
      },

      updateAddress: (id: string, addressData) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          const address = userData.addresses.find((a) => a.id === id);
          if (address) {
            Object.assign(address, addressData);
          }
        });
      },

      removeAddress: (id: string) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.addresses = userData.addresses.filter((a) => a.id !== id);
        });
      },

      clearAddresses: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.addresses = [];
        });
      },

      // Checkout actions
      setCheckoutProducts: (products) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.checkout = {
            ...userData.checkout,
            products,
            address: userData.checkout?.address ?? null,
            shipment: userData.checkout?.shipment ?? null,
            creditCard: userData.checkout?.creditCard ?? null,
          };
        });
      },
      setCheckoutAddress: (address) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.checkout = {
            ...userData.checkout,
            address,
            products: userData.checkout?.products ?? [],
            shipment: userData.checkout?.shipment ?? null,
            creditCard: userData.checkout?.creditCard ?? null,
          };
        });
      },
      setCheckoutShipment: (shipment) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.checkout = {
            ...userData.checkout,
            shipment,
            products: userData.checkout?.products ?? [],
            address: userData.checkout?.address ?? null,
            creditCard: userData.checkout?.creditCard ?? null,
          };
        });
      },
      setCheckoutCreditCard: (creditCard) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.checkout = {
            ...userData.checkout,
            creditCard,
            products: userData.checkout?.products ?? [],
            address: userData.checkout?.address ?? null,
            shipment: userData.checkout?.shipment ?? null,
          };
        });
      },
      clearCheckout: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.checkout = undefined;
        });
      },
      clearCheckoutProducts: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.checkout = {
            ...userData.checkout,
            products: [],
            address: userData.checkout?.address ?? null,
            shipment: userData.checkout?.shipment ?? null,
            creditCard: userData.checkout?.creditCard ?? null,
          };
        });
      },
      clearCheckoutAddress: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.checkout = {
            ...userData.checkout,
            address: null,
            products: userData.checkout?.products ?? [],
            shipment: userData.checkout?.shipment ?? null,
            creditCard: userData.checkout?.creditCard ?? null,
          };
        });
      },
      clearCheckoutShipment: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.checkout = {
            ...userData.checkout,
            shipment: null,
            products: userData.checkout?.products ?? [],
            address: userData.checkout?.address ?? null,
            creditCard: userData.checkout?.creditCard ?? null,
          };
        });
      },
      clearCheckoutCreditCard: () => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.checkout = {
            ...userData.checkout,
            creditCard: null,
            products: userData.checkout?.products ?? [],
            address: userData.checkout?.address ?? null,
            shipment: userData.checkout?.shipment ?? null,
          };
        });
      },

      // Utility actions
      getUserData: (userId: string) => {
        const { userData } = get();
        return userData[userId] ?? null;
      },

      clearUserData: (userId: string) => {
        set((state: UserStore) => {
          delete state.userData[userId];
        });
      },
    })),
    {
      name: 'user-store',
      // Save userData to localStorage
      partialize: (state) => ({ userData: state.userData }),
    },
  ),
);

// Selectors
export const useCurrentUserCart = () => {
  const currentUserId = useUserStore((s) => s.currentUserId);
  const userData = useUserStore((s) => s.userData);
  return currentUserId ? (userData[currentUserId]?.cart ?? []) : [];
};

export const useCurrentUserAddresses = () => {
  const currentUserId = useUserStore((s) => s.currentUserId);
  const userData = useUserStore((s) => s.userData);
  return currentUserId ? (userData[currentUserId]?.addresses ?? []) : [];
};

export const useCurrentCheckout = () => {
  const currentUserId = useUserStore((s) => s.currentUserId);
  const userData = useUserStore((s) => s.userData);
  return currentUserId ? (userData[currentUserId]?.checkout ?? null) : null;
};
