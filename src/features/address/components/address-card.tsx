'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { RadioGroupItem } from '@/components/ui/radio-group';
import type { Address } from '@/types/store';

import { DeleteAddress } from './delete-address';
import { EditAddress } from './edit-address';

export type AddressCardProps = {
  address: Address;
};

export function AddressCard({ address }: AddressCardProps) {
  return (
    <div className="flex items-center justify-between p-6 pr-2 sm:pr-6 bg-gray-100 rounded-lg min-h-[144px]">
      {/* Content */}
      <label className="flex-1 space-y-4 cursor-pointer select-none">
        {/* Top section with radio button, title, tag */}
        <div className="flex items-center gap-4">
          {/* Radio button */}
          <RadioGroupItem
            value={address.id}
            className="size-6 border-2 border-black"
          />
          {/* Title */}
          {address.title && (
            <h2 className="text-lg font-semibold">{address.title}</h2>
          )}
          {/* Tag */}
          {address.tag && <Badge>{address.tag}</Badge>}
        </div>

        {/* Info section */}
        <div className="ml-10 space-y-2">
          <p className="font-medium">{address.address}</p>
          <p>Tel: {address.phone}</p>
        </div>
      </label>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-4">
        <EditAddress address={address} />
        <DeleteAddress address={address} />
      </div>
    </div>
  );
}
