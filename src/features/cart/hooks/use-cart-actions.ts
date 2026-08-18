'use client';

import { Effect } from 'effect';
import * as React from 'react';

import { useSessionStore } from '@/features/session/store/session-store';
import { clientRuntime } from '@/lib/effect/client-runtime';

import type { CartProductSnapshotData } from '../domain';
import { CartService } from '../service/cart-service';

export function useCartActions() {
  const addItem = React.useCallback(
    async (product: CartProductSnapshotData, quantity = 1) => {
      const userId = useSessionStore.getState().currentUserId;
      if (!userId) return Promise.resolve(false);

      return clientRuntime
        .runPromise(
          Effect.gen(function* () {
            const cartService = yield* CartService.Service;
            yield* cartService.addItem(userId, product, quantity);
          }),
        )
        .then(() => true);
    },
    [],
  );

  const removeItem = React.useCallback(async (productId: string) => {
    const userId = useSessionStore.getState().currentUserId;
    if (!userId) return Promise.resolve(false);

    return clientRuntime
      .runPromise(
        Effect.gen(function* () {
          const cartService = yield* CartService.Service;
          yield* cartService.removeItem(userId, productId);
        }),
      )
      .then(() => true);
  }, []);

  const changeQuantity = React.useCallback(
    async (productId: string, quantity: number) => {
      const userId = useSessionStore.getState().currentUserId;
      if (!userId) return Promise.resolve(false);

      return clientRuntime
        .runPromise(
          Effect.gen(function* () {
            const cartService = yield* CartService.Service;
            yield* cartService.changeQuantity(userId, productId, quantity);
          }),
        )
        .then(() => true);
    },
    [],
  );

  const clear = React.useCallback(async () => {
    const userId = useSessionStore.getState().currentUserId;
    if (!userId) return Promise.resolve(false);

    return clientRuntime
      .runPromise(
        Effect.gen(function* () {
          const cartService = yield* CartService.Service;
          yield* cartService.clear(userId);
        }),
      )
      .then(() => true);
  }, []);

  return React.useMemo(
    () => ({ addItem, removeItem, changeQuantity, clear }),
    [addItem, removeItem, changeQuantity, clear],
  );
}
