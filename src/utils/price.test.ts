import { describe, expect, it } from 'vitest';

import type { Checkout } from '@/types/store';

import { getCheckoutTotals } from './price';

const product = (id: string, price: number) => ({
  id,
  name: `Product ${id}`,
  price,
  image: `/${id}.png`,
});

const checkout = (overrides: Partial<Checkout> = {}): Checkout => ({
  products: [
    { product: product('a', 100), quantity: 2 },
    { product: product('b', 50), quantity: 1 },
  ],
  address: null,
  shipment: null,
  creditCard: null,
  ...overrides,
});

describe('getCheckoutTotals', () => {
  it('returns zeros when there is no checkout', () => {
    expect(getCheckoutTotals(null)).toEqual({
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
    });
  });

  it('adds 8% tax and shipping to the subtotal', () => {
    const totals = getCheckoutTotals(
      checkout({
        shipment: { id: 'express', description: 'Express', price: 8.5 },
      }),
    );

    expect(totals).toEqual({
      subtotal: 250,
      tax: 20,
      shipping: 8.5,
      discount: 0,
      total: 278.5,
    });
  });

  it('subtracts the promo discount', () => {
    const totals = getCheckoutTotals(
      checkout({ promoCode: { code: 'SAVE50', discount: 50 } }),
    );

    expect(totals.discount).toBe(50);
    expect(totals.total).toBe(220);
  });

  it('never lets the discount push the total below zero', () => {
    const totals = getCheckoutTotals(
      checkout({
        products: [{ product: product('a', 8), quantity: 1 }],
        promoCode: { code: 'BIG', discount: 500 },
      }),
    );

    // subtotal 8 + tax 1 = 9, so the discount is capped at 9
    expect(totals.discount).toBe(9);
    expect(totals.total).toBe(0);
  });
});
