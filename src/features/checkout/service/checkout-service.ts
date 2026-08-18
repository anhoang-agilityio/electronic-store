'use client';

import { Context, Effect, Layer } from 'effect';

import type { Address } from '@/features/address/domain';
import { CartRepository } from '@/features/cart/repository/cart-repository';
import type { ShipmentInfo } from '@/features/shipment/domain';

import { Checkout, CreditCardInfo, type CreditCardInfoData } from '../domain';
import { CheckoutRepository } from '../repository/checkout-repository';

export type Interface = {
  startCheckout: (userId: string) => Effect.Effect<void>;
  setAddress: (userId: string, address: Address | null) => Effect.Effect<void>;
  setShipment: (
    userId: string,
    shipment: ShipmentInfo | null,
  ) => Effect.Effect<void>;
  setCreditCard: (
    userId: string,
    creditCard: CreditCardInfoData | null,
  ) => Effect.Effect<void>;
  clearCheckout: (userId: string) => Effect.Effect<void>;
  clearProducts: (userId: string) => Effect.Effect<void>;
  clearAddress: (userId: string) => Effect.Effect<void>;
  clearShipment: (userId: string) => Effect.Effect<void>;
  clearCreditCard: (userId: string) => Effect.Effect<void>;
  completeCheckout: (userId: string) => Effect.Effect<void>;
};

export class Service extends Context.Tag('CheckoutService')<
  Service,
  Interface
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const cartRepository = yield* CartRepository.Service;
    const checkoutRepository = yield* CheckoutRepository.Service;

    const updateCheckout = (
      userId: string,
      update: (checkout: Checkout) => Checkout,
    ) =>
      checkoutRepository.findByUserId(userId).pipe(
        Effect.map((checkout) => update(checkout ?? Checkout.empty())),
        Effect.flatMap((checkout) => checkoutRepository.save(userId, checkout)),
      );

    return Service.of({
      startCheckout: Effect.fn('CheckoutService.startCheckout')(
        function* (userId) {
          const cart = yield* cartRepository.findByUserId(userId);
          yield* updateCheckout(userId, (checkout) =>
            checkout.setProducts(cart.items),
          );
        },
      ),
      setAddress: Effect.fn('CheckoutService.setAddress')((userId, address) =>
        updateCheckout(userId, (checkout) => checkout.setAddress(address)),
      ),
      setShipment: Effect.fn('CheckoutService.setShipment')(
        (userId, shipment) =>
          updateCheckout(userId, (checkout) => checkout.setShipment(shipment)),
      ),
      setCreditCard: Effect.fn('CheckoutService.setCreditCard')(
        (userId, creditCard) =>
          updateCheckout(userId, (checkout) =>
            checkout.setCreditCard(
              creditCard ? new CreditCardInfo(creditCard) : null,
            ),
          ),
      ),
      clearCheckout: Effect.fn('CheckoutService.clearCheckout')((userId) =>
        checkoutRepository.removeByUserId(userId),
      ),
      clearProducts: Effect.fn('CheckoutService.clearProducts')((userId) =>
        updateCheckout(userId, (checkout) => checkout.clearProducts()),
      ),
      clearAddress: Effect.fn('CheckoutService.clearAddress')((userId) =>
        updateCheckout(userId, (checkout) => checkout.clearAddress()),
      ),
      clearShipment: Effect.fn('CheckoutService.clearShipment')((userId) =>
        updateCheckout(userId, (checkout) => checkout.clearShipment()),
      ),
      clearCreditCard: Effect.fn('CheckoutService.clearCreditCard')((userId) =>
        updateCheckout(userId, (checkout) => checkout.clearCreditCard()),
      ),
      completeCheckout: Effect.fn('CheckoutService.completeCheckout')(
        function* (userId) {
          yield* checkoutRepository.removeByUserId(userId);
          yield* cartRepository.removeByUserId(userId);
        },
      ),
    });
  }),
);

export const defaultLayer = layer.pipe(
  Layer.provide(
    Layer.merge(CartRepository.defaultLayer, CheckoutRepository.defaultLayer),
  ),
);

export * as CheckoutService from './checkout-service';
