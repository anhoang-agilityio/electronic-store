'use client';

import { RadioGroup } from '@/components/ui/radio-group';
import { useCurrentAddresses } from '@/features/address/hooks/use-addresses';
import { useCurrentCheckout } from '@/features/checkout/hooks/use-checkout';
import { useCheckoutActions } from '@/features/checkout/hooks/use-checkout-actions';

import { AddressCard } from './address-card';

export function UserAddressList() {
  const addresses = useCurrentAddresses();
  const checkout = useCurrentCheckout();
  const { setAddress } = useCheckoutActions();
  const selectedId = checkout?.address?.id ?? null;

  if (addresses.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <h1 className="sr-only">No address found</h1>
        No address found. Please add a new address.
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <h1 className="text-xl font-semibold">Select Address</h1>
      <RadioGroup
        value={selectedId}
        onValueChange={(id) => {
          const address = addresses.find((item) => item.id === id) ?? null;
          void setAddress(address);
        }}
        className="gap-4"
      >
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} />
        ))}
      </RadioGroup>
    </section>
  );
}
