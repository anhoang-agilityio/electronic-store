import { CartItem, Checkout, OrderTotals } from '@/types/store';

// Utility functions for cart/checkout price calculations

/**
 * Calculates the subtotal for a list of cart items
 * @param cart - Array of cart items
 * @returns subtotal as number
 */
export function getCartSubtotal(cart: CartItem[]): number {
  return cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
}

/**
 * Calculates the estimated tax (8%) for a given subtotal
 * @param subtotal - subtotal amount
 * @returns estimated tax as number
 */
export function getEstimatedTax(subtotal: number): number {
  return subtotal > 0 ? Math.round(subtotal * 0.08) : 0; // 8% tax
}

/**
 * Calculates the discounted price for a product
 * @param price - Original price of the product
 * @param discountPercent - Discount percentage (0-100)
 * @returns discounted price as number (rounded)
 */
export function getDiscountedPrice(
  price: number,
  discountPercent: number,
): number {
  if (!discountPercent || discountPercent <= 0) return Math.round(price);
  return Math.round(price * (1 - discountPercent / 100));
}

/**
 * Calculates the full price breakdown for a checkout
 * @param checkout - Current checkout (may be missing)
 * @returns subtotal, tax, shipping, discount and total
 */
export function getCheckoutTotals(
  checkout: Checkout | null | undefined,
): OrderTotals {
  const subtotal = getCartSubtotal(checkout?.products ?? []);
  const tax = getEstimatedTax(subtotal);
  const shipping = checkout?.shipment?.price ?? 0;
  const discount = checkout?.promoCode?.discount ?? 0;
  const total = subtotal + tax + shipping - discount;
  return { subtotal, tax, shipping, discount, total };
}
