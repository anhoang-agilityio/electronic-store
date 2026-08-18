'use client';

import { Context, Effect, Layer, Schema } from 'effect';

import { Cart } from '../domain';
import { useCartStore } from '../store/cart-store';

type Interface = {
  findByUserId: (userId: string) => Effect.Effect<Cart>;
  save: (userId: string, cart: Cart) => Effect.Effect<void>;
  removeByUserId: (userId: string) => Effect.Effect<void>;
};

export class Service extends Context.Tag('CartRepository')<
  Service,
  Interface
>() {}

export const layer = Layer.succeed(
  Service,
  Service.of({
    findByUserId: Effect.fn('CartRepository.findByUserId')((userId) =>
      Effect.sync(() => {
        const encoded = useCartStore.getState().cartsByUserId[userId];
        return encoded ? Schema.decodeUnknownSync(Cart)(encoded) : Cart.empty();
      }),
    ),
    save: Effect.fn('CartRepository.save')((userId, cart) =>
      Effect.sync(() => {
        useCartStore.getState().saveCart(userId, Schema.encodeSync(Cart)(cart));
      }),
    ),
    removeByUserId: Effect.fn('CartRepository.removeByUserId')((userId) =>
      Effect.sync(() => {
        useCartStore.getState().removeCart(userId);
      }),
    ),
  }),
);

export const defaultLayer = layer;

export * as CartRepository from './cart-repository';
