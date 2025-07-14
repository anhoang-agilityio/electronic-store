import React, { useState } from 'react';

import { RadioGroup } from '@/components/ui/radio-group';
import { useUserStore, useCurrentCheckout } from '@/stores/user-store';

import { ShipmentMethodCard } from './shipment-method-card';

const shipmentMethods = [
  {
    id: 'regular',
    description: 'Regularly shipment',
    price: 0,
  },
  {
    id: 'express',
    description: 'Get your delivary as soon as possible',
    price: 8.5,
  },
] as const;

export function ShipmentMethodList() {
  const setCheckoutShipment = useUserStore((s) => s.setCheckoutShipment);
  const checkout = useCurrentCheckout();
  const [selected, setSelected] = useState(checkout?.shipment?.id ?? null);

  const handleChange = (id: string) => {
    setSelected(id);
    const shipment = shipmentMethods.find((m) => m.id === id);
    if (!shipment) return;
    setCheckoutShipment(shipment);
  };

  return (
    <section className="space-y-8">
      <h1 className="text-xl font-semibold">Shipment Method</h1>
      <RadioGroup
        className="gap-4"
        value={selected}
        onValueChange={handleChange}
      >
        {shipmentMethods.map((method) => (
          <ShipmentMethodCard key={method.id} shipment={method} />
        ))}
      </RadioGroup>
    </section>
  );
}
