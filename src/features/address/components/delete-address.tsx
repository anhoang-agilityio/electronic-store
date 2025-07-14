import { X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useUserStore, useCurrentCheckout } from '@/stores/user-store';
import type { Address } from '@/types/store';

export function DeleteAddress({ address }: { address: Address }) {
  const [open, setOpen] = useState(false);
  const removeAddress = useUserStore((s) => s.removeAddress);
  const checkout = useCurrentCheckout();
  const clearCheckoutAddress = useUserStore((s) => s.clearCheckoutAddress);

  const handleDelete = () => {
    removeAddress(address.id);
    if (checkout?.address?.id === address.id) {
      clearCheckoutAddress();
    }
    setOpen(false);
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
