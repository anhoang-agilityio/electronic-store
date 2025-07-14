'use client';

import { StepActions } from '@/features/checkout/components/step-actions';
import { ShipmentMethodList } from '@/features/shipment/components/shipment-method-list';

export default function CheckoutStep2Page() {
  return (
    <main className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <ShipmentMethodList />
        <div className="mt-40 flex justify-end">
          <div className="w-full sm:max-w-md">
            <StepActions currentStep={2} />
          </div>
        </div>
      </div>
    </main>
  );
}
