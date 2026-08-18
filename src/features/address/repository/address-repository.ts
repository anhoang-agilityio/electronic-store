'use client';

import { Context, Effect, Layer, Schema } from 'effect';

import { Address } from '../domain';
import { useAddressStore } from '../store/address-store';

const Addresses = Schema.Array(Address);

type Interface = {
  findAllByUserId: (userId: string) => Effect.Effect<readonly Address[]>;
  save: (userId: string, addresses: readonly Address[]) => Effect.Effect<void>;
  removeByUserId: (userId: string) => Effect.Effect<void>;
};

export class Service extends Context.Tag('AddressRepository')<
  Service,
  Interface
>() {}

export const layer = Layer.succeed(
  Service,
  Service.of({
    findAllByUserId: Effect.fn('AddressRepository.findAllByUserId')((userId) =>
      Effect.sync(() => {
        const encoded =
          useAddressStore.getState().addressesByUserId[userId] ?? [];
        return Schema.decodeUnknownSync(Addresses)(encoded);
      }),
    ),
    save: Effect.fn('AddressRepository.save')((userId, addresses) =>
      Effect.sync(() => {
        useAddressStore
          .getState()
          .saveAddresses(userId, Schema.encodeSync(Addresses)(addresses));
      }),
    ),
    removeByUserId: Effect.fn('AddressRepository.removeByUserId')((userId) =>
      Effect.sync(() => {
        useAddressStore.getState().removeAddresses(userId);
      }),
    ),
  }),
);

export const defaultLayer = layer;

export * as AddressRepository from './address-repository';
