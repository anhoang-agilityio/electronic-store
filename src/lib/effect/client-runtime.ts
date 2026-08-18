'use client';

import { Layer, ManagedRuntime } from 'effect';

import { AddressService } from '@/features/address/service/address-service';
import { CartService } from '@/features/cart/service/cart-service';
import { CheckoutService } from '@/features/checkout/service/checkout-service';
import { UserService } from '@/features/user/service/user-service';

const clientLayer = Layer.mergeAll(
  AddressService.defaultLayer,
  CartService.defaultLayer,
  CheckoutService.defaultLayer,
  UserService.defaultLayer,
);

export const clientRuntime = ManagedRuntime.make(clientLayer);
