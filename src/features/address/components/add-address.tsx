'use client';

import { Plus } from 'lucide-react';
import * as React from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUserStore } from '@/stores/user-store';

import { AddressForm, AddressFormValues } from './address-form';

export function AddAddress() {
  const [open, setOpen] = React.useState(false);
  const addAddress = useUserStore((s) => s.addAddress);

  function onSubmit(data: AddressFormValues) {
    addAddress({
      address: data.address,
      phone: data.phone,
      title: data.title ?? undefined,
      tag: data.tag ?? undefined,
    });
    setOpen(false);
  }

  return (
    <>
      {/* Add New Address Button */}
      <section className="w-full flex flex-col items-center">
        <div className="flex items-center w-full">
          <div className="flex-1 h-px bg-gradient-to-l from-black to-gray-200" />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Add new address"
            aria-describedby="add-address-label"
            className="mx-2 rounded-full bg-primary flex items-center justify-center size-6 cursor-pointer"
          >
            <Plus className="size-4 text-primary-foreground" />
          </button>
          <div className="flex-1 h-px bg-gradient-to-r from-black to-gray-200" />
        </div>
        <span id="add-address-label" className="mt-2 text-sm font-medium">
          Add New Address
        </span>
      </section>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm
            onSubmit={onSubmit}
            onCancel={() => {
              setOpen(false);
            }}
            submitText="Save"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
