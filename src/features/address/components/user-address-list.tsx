'use client';

import * as React from 'react';

import { RadioGroup } from '@/components/ui/radio-group';
import {
  useCurrentUserAddresses,
  useCurrentCheckout,
  useUserStore,
} from '@/stores/user-store';

import { AddressCard } from './address-card';

export function UserAddressList() {
  const addresses = useCurrentUserAddresses();
  const checkout = useCurrentCheckout();
  const setCheckoutAddress = useUserStore((s) => s.setCheckoutAddress);

  // Get the id of checkout address if available, fallback to addresses[0]?.id
  const initialSelectedId = checkout?.address?.id ?? null;
  const [selectedId, setSelectedId] = React.useState<string | null>(
    initialSelectedId,
  );

  if (!addresses.length) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No address found. Please add a new address.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Select Address</h1>
      <RadioGroup
        value={selectedId}
        onValueChange={(id) => {
          setSelectedId(id);
          const address = addresses.find((a) => a.id === id) ?? null;
          setCheckoutAddress(address);
        }}
        className="gap-4"
      >
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </RadioGroup>
    </div>
  );
}
