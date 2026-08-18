'use client';

import { Context, Effect, Layer } from 'effect';

import {
  CartProductSnapshot,
  type CartProductSnapshotData,
  type InvalidCartQuantity,
} from '../domain';
import { CartRepository } from '../repository/cart-repository';

type Interface = {
  addItem: (
    userId: string,
    product: CartProductSnapshotData,
    quantity?: number,
  ) => Effect.Effect<void, InvalidCartQuantity>;
  removeItem: (userId: string, productId: string) => Effect.Effect<void>;
  changeQuantity: (
    userId: string,
    productId: string,
    quantity: number,
  ) => Effect.Effect<void, InvalidCartQuantity>;
  clear: (userId: string) => Effect.Effect<void>;
};

export class Service extends Context.Tag('CartService')<Service, Interface>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const cartRepository = yield* CartRepository.Service;

    return Service.of({
      addItem: Effect.fn('CartService.addItem')(function* (
        userId,
        product,
        quantity = 1,
      ) {
        const cart = yield* cartRepository.findByUserId(userId);
        const updatedCart = yield* cart.addItem(
          new CartProductSnapshot(product),
          quantity,
        );
        yield* cartRepository.save(userId, updatedCart);
      }),
      removeItem: Effect.fn('CartService.removeItem')(
        function* (userId, productId) {
          const cart = yield* cartRepository.findByUserId(userId);
          yield* cartRepository.save(userId, cart.removeItem(productId));
        },
      ),
      changeQuantity: Effect.fn('CartService.changeQuantity')(
        function* (userId, productId, quantity) {
          const cart = yield* cartRepository.findByUserId(userId);
          const updatedCart = yield* cart.changeQuantity(productId, quantity);
          yield* cartRepository.save(userId, updatedCart);
        },
      ),
      clear: Effect.fn('CartService.clear')((userId) =>
        cartRepository.removeByUserId(userId),
      ),
    });
  }),
);

export const defaultLayer = layer.pipe(
  Layer.provide(CartRepository.defaultLayer),
);

export * as CartService from './cart-service';
