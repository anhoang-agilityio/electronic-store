'use client';

import { Context, Effect, Layer } from 'effect';
import { v4 as uuidv4 } from 'uuid';

import { Address, type AddressInput } from '../domain';
import { AddressRepository } from '../repository/address-repository';

type Interface = {
  addAddress: (userId: string, input: AddressInput) => Effect.Effect<Address>;
  updateAddress: (
    userId: string,
    addressId: string,
    input: AddressInput,
  ) => Effect.Effect<Address | null>;
  removeAddress: (userId: string, addressId: string) => Effect.Effect<void>;
  clearAddresses: (userId: string) => Effect.Effect<void>;
};

export class Service extends Context.Tag('AddressService')<
  Service,
  Interface
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const addressRepository = yield* AddressRepository.Service;

    return Service.of({
      addAddress: Effect.fn('AddressService.addAddress')(
        function* (userId, input) {
          const addresses = yield* addressRepository.findAllByUserId(userId);
          const address = new Address({ id: uuidv4(), ...input });
          yield* addressRepository.save(userId, [...addresses, address]);
          return address;
        },
      ),
      updateAddress: Effect.fn('AddressService.updateAddress')(
        function* (userId, addressId, input) {
          const addresses = yield* addressRepository.findAllByUserId(userId);
          const existingAddress = addresses.find(({ id }) => id === addressId);
          if (!existingAddress) return null;

          const updatedAddress = existingAddress.update(input);
          yield* addressRepository.save(
            userId,
            addresses.map((address) =>
              address.id === addressId ? updatedAddress : address,
            ),
          );
          return updatedAddress;
        },
      ),
      removeAddress: Effect.fn('AddressService.removeAddress')(
        function* (userId, addressId) {
          const addresses = yield* addressRepository.findAllByUserId(userId);
          yield* addressRepository.save(
            userId,
            addresses.filter(({ id }) => id !== addressId),
          );
        },
      ),
      clearAddresses: Effect.fn('AddressService.clearAddresses')((userId) =>
        addressRepository.removeByUserId(userId),
      ),
    });
  }),
);

export const defaultLayer = layer.pipe(
  Layer.provide(AddressRepository.defaultLayer),
);

export * as AddressService from './address-service';
