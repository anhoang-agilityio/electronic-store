import { Edit } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUserStore, useCurrentCheckout } from '@/stores/user-store';
import type { Address } from '@/types/store';

import { AddressForm, AddressFormValues } from './address-form';

export function EditAddress({ address }: { address: Address }) {
  const [open, setOpen] = useState(false);
  const updateAddress = useUserStore((s) => s.updateAddress);
  const checkout = useCurrentCheckout();
  const setCheckoutAddress = useUserStore((s) => s.setCheckoutAddress);

  const handleEditSubmit = (values: AddressFormValues) => {
    updateAddress(address.id, values);
    if (checkout?.address?.id === address.id) {
      setCheckoutAddress({ ...address, ...values });
    }
    setOpen(false);
  };

  return (
    <>
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
          <AddressForm
            initialValues={address}
            onSubmit={handleEditSubmit}
            onCancel={() => setOpen(false)}
            submitText="Save"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
