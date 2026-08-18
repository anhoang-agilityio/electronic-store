'use client';

import { RadioGroup } from '@/components/ui/radio-group';
import { useCurrentCheckout } from '@/features/checkout/hooks/use-checkout';
import { useCheckoutActions } from '@/features/checkout/hooks/use-checkout-actions';
import { ShipmentInfo } from '@/features/shipment/domain';

import { ShipmentMethodCard } from './shipment-method-card';

const shipmentMethods = [
  new ShipmentInfo({
    id: 'regular',
    description: 'Regularly shipment',
    price: 0,
  }),
  new ShipmentInfo({
    id: 'express',
    description: 'Get your delivary as soon as possible',
    price: 8.5,
  }),
];

export function ShipmentMethodList() {
  const { setShipment } = useCheckoutActions();
  const checkout = useCurrentCheckout();

  const handleChange = (id: string) => {
    const shipment = shipmentMethods.find((method) => method.id === id);
    if (shipment) void setShipment(shipment);
  };

  return (
    <section className="space-y-8">
      <h1 className="text-xl font-semibold">Shipment Method</h1>
      <RadioGroup
        className="gap-4"
        value={checkout?.shipment?.id ?? null}
        onValueChange={handleChange}
      >
        {shipmentMethods.map((method) => (
          <ShipmentMethodCard key={method.id} shipment={method} />
        ))}
      </RadioGroup>
    </section>
  );
}
