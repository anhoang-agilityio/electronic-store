'use client';

import { Edit } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Address } from '@/features/address/domain';
import { useAddressActions } from '@/features/address/hooks/use-address-actions';
import { useCurrentCheckout } from '@/features/checkout/hooks/use-checkout';
import { useCheckoutActions } from '@/features/checkout/hooks/use-checkout-actions';

import { AddressForm, AddressFormValues } from './address-form';

export function EditAddress({ address }: { address: Address }) {
  const [open, setOpen] = useState(false);
  const { updateAddress } = useAddressActions();
  const { setAddress } = useCheckoutActions();
  const checkout = useCurrentCheckout();

  const handleEditSubmit = (values: AddressFormValues) => {
    void updateAddress(address.id, values).then((updatedAddress) => {
      if (!updatedAddress) return;

      if (checkout?.address?.id === address.id) {
        void setAddress(updatedAddress);
      }
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-circle" aria-label="Edit address">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit address form
        </DialogDescription>
        <AddressForm
          initialValues={address}
          onSubmit={handleEditSubmit}
          onCancel={() => setOpen(false)}
          submitText="Save"
        />
      </DialogContent>
    </Dialog>
  );
}
