import { describe, expect, it } from 'vitest';

import { generateOrderNumber } from './order-number';

describe('generateOrderNumber', () => {
  it('uses the ES- prefix followed by 6 unambiguous characters', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateOrderNumber()).toMatch(/^ES-[A-HJ-NP-Z2-9]{6}$/);
    }
  });

  it('generates different numbers', () => {
    const numbers = new Set(
      Array.from({ length: 20 }, () => generateOrderNumber()),
    );

    expect(numbers.size).toBeGreaterThan(1);
  });
});
