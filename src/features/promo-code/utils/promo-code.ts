import type { PromoCode } from '@/types/api';

/**
 * Normalizes a user-entered promo code for matching
 * @param code - Raw promo code input
 * @returns trimmed, upper-cased code
 */
export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

/**
 * Checks whether a promo code has expired
 * @param promo - Promo code definition
 * @param now - Current date (defaults to now)
 * @returns true if the promo code is no longer valid
 */
export function isPromoCodeExpired(
  promo: PromoCode,
  now: Date = new Date(),
): boolean {
  return new Date(promo.expiresAt) < now;
}

/**
 * Calculates the discount amount of a promo code for a given subtotal
 * @param promo - Promo code definition
 * @param subtotal - Order subtotal
 * @returns discount amount as number (rounded)
 */
export function calculatePromoDiscount(
  promo: PromoCode,
  subtotal: number,
): number {
  if (promo.type === 'percent') {
    const discount = Math.round((subtotal * promo.value) / 100);
    return promo.maxDiscount ? Math.min(discount, promo.maxDiscount) : discount;
  }

  return promo.value;
}
