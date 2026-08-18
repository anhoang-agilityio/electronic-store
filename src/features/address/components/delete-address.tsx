'use client';

import { X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import type { Address } from '@/features/address/domain';
import { useAddressActions } from '@/features/address/hooks/use-address-actions';
import { useCurrentCheckout } from '@/features/checkout/hooks/use-checkout';
import { useCheckoutActions } from '@/features/checkout/hooks/use-checkout-actions';

export function DeleteAddress({ address }: { address: Address }) {
  const [open, setOpen] = useState(false);
  const { removeAddress } = useAddressActions();
  const { clearAddress } = useCheckoutActions();
  const checkout = useCurrentCheckout();

  const handleDelete = () => {
    void removeAddress(address.id).then((removed) => {
      if (!removed) return;

      if (checkout?.address?.id === address.id) {
        void clearAddress();
      }
      setOpen(false);
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-circle"
        onClick={() => setOpen(true)}
        aria-label="Delete address"
      >
        <X />
      </Button>
      <ConfirmationDialog
        open={open}
        title="Delete Address"
        description="Are you sure you want to delete this address?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
