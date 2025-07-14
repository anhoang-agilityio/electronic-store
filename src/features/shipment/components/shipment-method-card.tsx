import React from 'react';

import { RadioGroupItem } from '@/components/ui/radio-group';
import type { ShipmentInfo } from '@/types/store';

export type ShipmentMethodCardProps = {
  shipment: ShipmentInfo;
};

export function ShipmentMethodCard({ shipment }: ShipmentMethodCardProps) {
  return (
    <label
      htmlFor={`shipping-radio-${shipment.id}`}
      className="flex gap-4 items-center bg-white border rounded-lg min-h-18 px-6 py-4 cursor-pointer select-none"
    >
      <RadioGroupItem
        value={shipment.id}
        id={`shipping-radio-${shipment.id}`}
        aria-label={shipment.description}
        className="size-6 border-2 border-black"
      />
      <div className="flex flex-col items-baseline sm:flex-row gap-1 sm:gap-4 min-w-0">
        <span className="text-lg font-semibold">
          {shipment.price === 0 ? 'Free' : `$${shipment.price.toFixed(2)}`}
        </span>
        <span>{shipment.description}</span>
      </div>
    </label>
  );
}
