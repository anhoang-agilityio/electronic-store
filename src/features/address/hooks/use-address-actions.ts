'use client';

import { Effect } from 'effect';
import * as React from 'react';

import { useSessionStore } from '@/features/session/store/session-store';
import { clientRuntime } from '@/lib/effect/client-runtime';

import type { AddressInput } from '../domain';
import { AddressService } from '../service/address-service';

export function useAddressActions() {
  const addAddress = React.useCallback((input: AddressInput) => {
    const userId = useSessionStore.getState().currentUserId;
    if (!userId) return Promise.resolve(null);

    return clientRuntime.runPromise(
      Effect.gen(function* () {
        const addressService = yield* AddressService.Service;
        return yield* addressService.addAddress(userId, input);
      }),
    );
  }, []);

  const updateAddress = React.useCallback(
    (addressId: string, input: AddressInput) => {
      const userId = useSessionStore.getState().currentUserId;
      if (!userId) return Promise.resolve(null);

      return clientRuntime.runPromise(
        Effect.gen(function* () {
          const addressService = yield* AddressService.Service;
          return yield* addressService.updateAddress(userId, addressId, input);
        }),
      );
    },
    [],
  );

  const removeAddress = React.useCallback((addressId: string) => {
    const userId = useSessionStore.getState().currentUserId;
    if (!userId) return Promise.resolve(false);

    return clientRuntime
      .runPromise(
        Effect.gen(function* () {
          const addressService = yield* AddressService.Service;
          yield* addressService.removeAddress(userId, addressId);
        }),
      )
      .then(() => true);
  }, []);

  const clearAddresses = React.useCallback(() => {
    const userId = useSessionStore.getState().currentUserId;
    if (!userId) return Promise.resolve(false);

    return clientRuntime
      .runPromise(
        Effect.gen(function* () {
          const addressService = yield* AddressService.Service;
          yield* addressService.clearAddresses(userId);
        }),
      )
      .then(() => true);
  }, []);

  return React.useMemo(
    () => ({ addAddress, updateAddress, removeAddress, clearAddresses }),
    [addAddress, updateAddress, removeAddress, clearAddresses],
  );
}
