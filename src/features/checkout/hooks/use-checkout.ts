'use client';

import { Schema } from 'effect';
import * as React from 'react';

import { useCurrentUserId } from '@/features/session/hooks/use-current-user-id';

import { Checkout } from '../domain';
import { useCheckoutStore } from '../store/checkout-store';

export function useCheckout(userId: string | null): Checkout | null {
  const encodedCheckout = useCheckoutStore((state) =>
    userId ? state.checkoutsByUserId[userId] : undefined,
  );

  return React.useMemo(
    () =>
      encodedCheckout
        ? Schema.decodeUnknownSync(Checkout)(encodedCheckout)
        : null,
    [encodedCheckout],
  );
}

export function useCurrentCheckout(): Checkout | null {
  const userId = useCurrentUserId();
  return useCheckout(userId);
}
