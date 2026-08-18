'use client';

import { Context, Effect, Layer } from 'effect';

import { AddressRepository } from '@/features/address/repository/address-repository';
import { CartRepository } from '@/features/cart/repository/cart-repository';
import { CheckoutRepository } from '@/features/checkout/repository/checkout-repository';

type Interface = {
  clearLocalUserData: (userId: string) => Effect.Effect<void>;
};

export class Service extends Context.Tag('UserService')<Service, Interface>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const addressRepository = yield* AddressRepository.Service;
    const cartRepository = yield* CartRepository.Service;
    const checkoutRepository = yield* CheckoutRepository.Service;

    return Service.of({
      clearLocalUserData: Effect.fn('UserService.clearLocalUserData')(
        function* (userId) {
          yield* cartRepository.removeByUserId(userId);
          yield* addressRepository.removeByUserId(userId);
          yield* checkoutRepository.removeByUserId(userId);
        },
      ),
    });
  }),
);

export const defaultLayer = layer.pipe(
  Layer.provide(
    Layer.mergeAll(
      AddressRepository.defaultLayer,
      CartRepository.defaultLayer,
      CheckoutRepository.defaultLayer,
    ),
  ),
);

export * as UserService from './user-service';
