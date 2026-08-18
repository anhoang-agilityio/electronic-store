'use client';

import { Context, Effect, Layer, Schema } from 'effect';

import { Checkout } from '../domain';
import { useCheckoutStore } from '../store/checkout-store';

type Interface = {
  findByUserId: (userId: string) => Effect.Effect<Checkout | null>;
  save: (userId: string, checkout: Checkout) => Effect.Effect<void>;
  removeByUserId: (userId: string) => Effect.Effect<void>;
};

export class Service extends Context.Tag('CheckoutRepository')<
  Service,
  Interface
>() {}

export const layer = Layer.succeed(
  Service,
  Service.of({
    findByUserId: Effect.fn('CheckoutRepository.findByUserId')((userId) =>
      Effect.sync(() => {
        const encoded = useCheckoutStore.getState().checkoutsByUserId[userId];
        return encoded ? Schema.decodeUnknownSync(Checkout)(encoded) : null;
      }),
    ),
    save: Effect.fn('CheckoutRepository.save')((userId, checkout) =>
      Effect.sync(() => {
        useCheckoutStore
          .getState()
          .saveCheckout(userId, Schema.encodeSync(Checkout)(checkout));
      }),
    ),
    removeByUserId: Effect.fn('CheckoutRepository.removeByUserId')((userId) =>
      Effect.sync(() => {
        useCheckoutStore.getState().removeCheckout(userId);
      }),
    ),
  }),
);

export const defaultLayer = layer;

export * as CheckoutRepository from './checkout-repository';
