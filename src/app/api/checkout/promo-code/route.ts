import { NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/auth';
import { getProduct } from '@/features/product/api/get-product';
import { findPromoCode } from '@/features/promo-code/data/promo-codes';
import {
  calculatePromoDiscount,
  isPromoCodeExpired,
} from '@/features/promo-code/utils/promo-code';
import type { ApplyPromoCodeResponse } from '@/types/api';

const ApplyPromoCodeSchema = z.object({
  code: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative(),
      }),
    )
    .min(1),
});

// Redeemed promo codes per user (in-memory until orders are persisted)
const redeemedCodes = new Map<string, Set<string>>();

export async function POST(request: Request) {
  try {
    // Only signed-in users reach this route (see protectedRoutes in middleware)
    const session = await auth();
    const userId = session?.user?.id;

    const parsed = ApplyPromoCodeSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid promo code request.' },
        { status: 400 },
      );
    }

    const { code, items } = parsed.data;

    const promo = findPromoCode(code);
    if (!promo) {
      return NextResponse.json(
        { error: 'This promo code does not exist.' },
        { status: 404 },
      );
    }

    if (isPromoCodeExpired(promo)) {
      return NextResponse.json(
        { error: 'This promo code has expired.' },
        { status: 410 },
      );
    }

    const redeemed = userId ? redeemedCodes.get(userId) : undefined;
    if (redeemed?.has(code)) {
      return NextResponse.json(
        { error: 'You have already used this promo code.' },
        { status: 409 },
      );
    }

    const products = await Promise.all(
      items.map((item) => getProduct(item.productId)),
    );
    if (products.some((product) => product.availability === 'out_of_stock')) {
      return NextResponse.json(
        { error: 'Some products in your order are out of stock.' },
        { status: 400 },
      );
    }

    // Cart prices already include the product discount, so use them as-is
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (promo.minSubtotal && subtotal < promo.minSubtotal) {
      return NextResponse.json(
        {
          error: `This promo code requires a minimum order of $${promo.minSubtotal}.`,
        },
        { status: 400 },
      );
    }

    const discount = calculatePromoDiscount(promo, subtotal);

    if (userId) {
      redeemedCodes.set(userId, (redeemed ?? new Set<string>()).add(code));
    }

    const response: ApplyPromoCodeResponse = {
      code: promo.code,
      discount,
      subtotal,
      total: subtotal - discount,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
