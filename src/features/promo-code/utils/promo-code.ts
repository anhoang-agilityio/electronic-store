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
 * A code stays valid until the end of its expiry date (UTC)
 * @param promo - Promo code definition
 * @param now - Current date (defaults to now)
 * @returns true if the promo code is no longer valid
 */
export function isPromoCodeExpired(
  promo: PromoCode,
  now: Date = new Date(),
): boolean {
  return now > new Date(`${promo.expiresAt}T23:59:59.999Z`);
}

/**
 * Calculates the discount amount of a promo code for a given subtotal
 * @param promo - Promo code definition
 * @param subtotal - Order subtotal
 * @returns discount amount as number (rounded, never more than the subtotal)
 */
export function calculatePromoDiscount(
  promo: PromoCode,
  subtotal: number,
): number {
  const discount =
    promo.type === 'percent'
      ? Math.round((subtotal * promo.value) / 100)
      : promo.value;
  const capped = promo.maxDiscount
    ? Math.min(discount, promo.maxDiscount)
    : discount;

  return Math.max(0, Math.min(capped, subtotal));
}
