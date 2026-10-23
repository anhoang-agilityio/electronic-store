import { NextResponse } from 'next/server';
import { z } from 'zod';

import { auth } from '@/auth';
import { getProduct } from '@/features/product/api/get-product';
import { findPromoCode } from '@/features/promo-code/data/promo-codes';
import {
  calculatePromoDiscount,
  isPromoCodeExpired,
} from '@/features/promo-code/utils/promo-code';
import { ApiError } from '@/lib/api-client';
import type { ApplyPromoCodeResponse } from '@/types/api';
import { getDiscountedPrice } from '@/utils/price';

const MAX_ITEMS = 50;

const ApplyPromoCodeSchema = z.object({
  code: z.string().trim().min(1).max(32),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().max(99),
      }),
    )
    .min(1)
    .max(MAX_ITEMS),
});

// Redeemed promo codes per user (in-memory until orders are persisted)
const redeemedCodes = new Map<string, Set<string>>();

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  // Middleware does not run on /api routes, so the route checks the session itself
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return errorResponse('Please sign in to use a promo code.', 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid promo code request.', 400);
  }

  const parsed = ApplyPromoCodeSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse('Invalid promo code request.', 400);
  }

  const promo = findPromoCode(parsed.data.code);
  if (!promo) {
    return errorResponse('This promo code does not exist.', 404);
  }

  if (isPromoCodeExpired(promo)) {
    return errorResponse('This promo code has expired.', 410);
  }

  if (redeemedCodes.get(userId)?.has(promo.code)) {
    return errorResponse('You have already used this promo code.', 409);
  }

  // Merge duplicate products so each product is fetched once
  const quantities = new Map<string, number>();
  for (const item of parsed.data.items) {
    quantities.set(
      item.productId,
      (quantities.get(item.productId) ?? 0) + item.quantity,
    );
  }

  let subtotal = 0;
  try {
    const products = await Promise.all(
      [...quantities.keys()].map((productId) => getProduct(productId)),
    );

    if (products.some((product) => product.availability === 'out_of_stock')) {
      return errorResponse(
        'Some products in your order are out of stock.',
        400,
      );
    }

    // Prices come from the product API, never from the client
    subtotal = products.reduce(
      (sum, product) =>
        sum +
        getDiscountedPrice(product.price, product.discountPercent) *
          (quantities.get(product.id) ?? 0),
      0,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return errorResponse(
        'Some products in your order are no longer available.',
        400,
      );
    }
    return errorResponse(
      'Could not apply the promo code. Please try again.',
      500,
    );
  }

  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return errorResponse(
      `This promo code requires a minimum order of $${promo.minSubtotal}.`,
      400,
    );
  }

  // Check and record with no await in between, so concurrent requests
  // for the same user cannot both redeem the code
  const redeemed = redeemedCodes.get(userId) ?? new Set<string>();
  if (redeemed.has(promo.code)) {
    return errorResponse('You have already used this promo code.', 409);
  }
  redeemedCodes.set(userId, redeemed.add(promo.code));

  const discount = calculatePromoDiscount(promo, subtotal);
  const response: ApplyPromoCodeResponse = {
    code: promo.code,
    discount,
    subtotal,
    total: subtotal - discount,
  };

  return NextResponse.json(response);
}
