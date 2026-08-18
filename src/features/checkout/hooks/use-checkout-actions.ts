'use client';

import { Effect } from 'effect';
import * as React from 'react';

import type { Address } from '@/features/address/domain';
import { useSessionStore } from '@/features/session/store/session-store';
import type { ShipmentInfo } from '@/features/shipment/domain';
import { clientRuntime } from '@/lib/effect/client-runtime';

import type { CreditCardInfoData } from '../domain';
import {
  CheckoutService,
  type Interface as CheckoutServiceInterface,
} from '../service/checkout-service';

export function useCheckoutActions() {
  const run = React.useCallback(
    async (
      operation: (
        service: CheckoutServiceInterface,
        userId: string,
      ) => Effect.Effect<void>,
    ) => {
      const userId = useSessionStore.getState().currentUserId;
      if (!userId) return Promise.resolve(false);

      return clientRuntime
        .runPromise(
          Effect.gen(function* () {
            const checkoutService = yield* CheckoutService.Service;
            yield* operation(checkoutService, userId);
          }),
        )
        .then(() => true);
    },
    [],
  );

  return React.useMemo(
    () => ({
      startCheckout: () =>
        run((service, userId) => service.startCheckout(userId)),
      setAddress: (address: Address | null) =>
        run((service, userId) => service.setAddress(userId, address)),
      setShipment: (shipment: ShipmentInfo | null) =>
        run((service, userId) => service.setShipment(userId, shipment)),
      setCreditCard: (creditCard: CreditCardInfoData | null) =>
        run((service, userId) => service.setCreditCard(userId, creditCard)),
      clearCheckout: () =>
        run((service, userId) => service.clearCheckout(userId)),
      clearProducts: () =>
        run((service, userId) => service.clearProducts(userId)),
      clearAddress: () =>
        run((service, userId) => service.clearAddress(userId)),
      clearShipment: () =>
        run((service, userId) => service.clearShipment(userId)),
      clearCreditCard: () =>
        run((service, userId) => service.clearCreditCard(userId)),
      completeCheckout: () =>
        run((service, userId) => service.completeCheckout(userId)),
    }),
    [run],
  );
}
