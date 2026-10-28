'use client';

import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { generateOrderNumber } from '@/features/order/utils/order-number';
import {
  Address,
  AppliedPromoCode,
  CartItem,
  CreditCardInfo,
  Order,
  ShipmentInfo,
  UserData,
} from '@/types/store';
import { getCheckoutTotals } from '@/utils/price';

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
  setCheckoutPromoCode: (promoCode: AppliedPromoCode | null) => void;
  clearCheckout: () => void;
  clearCheckoutProducts: () => void;
  clearCheckoutAddress: () => void;
  clearCheckoutShipment: () => void;
  clearCheckoutCreditCard: () => void;

  // Order actions
  placeOrder: () => Order | null;

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
            // Discount was calculated for the previous products
            promoCode: null,
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
      setCheckoutPromoCode: (promoCode) => {
        const { currentUserId } = get();
        if (!currentUserId) return;

        set((state: UserStore) => {
          const userData = state.userData[currentUserId];
          if (!userData) return;

          userData.checkout = {
            ...userData.checkout,
            promoCode,
            products: userData.checkout?.products ?? [],
            address: userData.checkout?.address ?? null,
            shipment: userData.checkout?.shipment ?? null,
            creditCard: userData.checkout?.creditCard ?? null,
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
            promoCode: null,
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

      // Order actions
      placeOrder: () => {
        const { currentUserId, userData } = get();
        if (!currentUserId) return null;

        const checkout = userData[currentUserId]?.checkout;
        if (
          !checkout ||
          checkout.products.length === 0 ||
          !checkout.address ||
          !checkout.shipment
        ) {
          return null;
        }

        // Snapshot only: credit card details are intentionally not stored
        const order: Order = {
          id: uuidv4(),
          number: generateOrderNumber(),
          createdAt: new Date().toISOString(),
          items: checkout.products.map((item) => ({
            product: { ...item.product },
            quantity: item.quantity,
          })),
          address: { ...checkout.address },
          shipment: { ...checkout.shipment },
          promoCode: checkout.promoCode ? { ...checkout.promoCode } : null,
          totals: getCheckoutTotals(checkout),
        };

        set((state: UserStore) => {
          const user = state.userData[currentUserId];
          if (!user) return;

          user.orders = [order, ...(user.orders ?? [])];
        });

        return order;
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

const EMPTY_ORDERS: Order[] = [];

export const useCurrentOrders = () => {
  const currentUserId = useUserStore((s) => s.currentUserId);
  const orders = useUserStore((s) =>
    s.currentUserId ? s.userData[s.currentUserId]?.orders : undefined,
  );
  // Orders are prepended on creation, so the stored order is newest first
  return currentUserId ? (orders ?? EMPTY_ORDERS) : EMPTY_ORDERS;
};

export const useOrder = (orderId: string) => {
  const orders = useCurrentOrders();
  return orders.find((order) => order.id === orderId) ?? null;
};
