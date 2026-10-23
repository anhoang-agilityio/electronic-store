import type { PromoCode } from '@/types/api';

import { normalizePromoCode } from '../utils/promo-code';

// Mock promo code catalogue until promo codes are served by the backend
export const PROMO_CODES: PromoCode[] = [
  {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    maxDiscount: 100,
    expiresAt: '2026-12-31',
  },
  {
    code: 'SAVE50',
    type: 'fixed',
    value: 50,
    minSubtotal: 300,
    expiresAt: '2026-11-30',
  },
  {
    code: 'BLACKFRIDAY',
    type: 'percent',
    value: 25,
    maxDiscount: 500,
    expiresAt: '2026-11-27',
  },
  {
    code: 'GIFT200',
    type: 'fixed',
    value: 200,
    expiresAt: '2027-01-31',
  },
];

export function findPromoCode(code: string): PromoCode | undefined {
  const normalized = normalizePromoCode(code);
  return PROMO_CODES.find((promo) => promo.code === normalized);
}

export function isKnownPromoCode(code: string): boolean {
  return findPromoCode(code) !== undefined;
}
