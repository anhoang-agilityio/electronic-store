'use client';

import { Schema } from 'effect';
import * as React from 'react';

import { useCurrentUserId } from '@/features/session/hooks/use-current-user-id';

import { Address } from '../domain';
import { useAddressStore } from '../store/address-store';

const Addresses = Schema.Array(Address);
const EMPTY_ADDRESSES: readonly Address[] = [];

export function useAddresses(userId: string | null): readonly Address[] {
  const encodedAddresses = useAddressStore((state) =>
    userId ? state.addressesByUserId[userId] : undefined,
  );

  return React.useMemo(
    () =>
      encodedAddresses
        ? Schema.decodeUnknownSync(Addresses)(encodedAddresses)
        : EMPTY_ADDRESSES,
    [encodedAddresses],
  );
}

export function useCurrentAddresses(): readonly Address[] {
  const userId = useCurrentUserId();
  return useAddresses(userId);
}
