import { AddAddress } from '@/features/address/components/add-address';
import { UserAddressList } from '@/features/address/components/user-address-list';
import { StepActions } from '@/features/checkout/components/step-actions';

export default function CheckoutStep1Page() {
  return (
    <main className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <UserAddressList />
        <div className="mt-12">
          <AddAddress />
        </div>
        <div className="mt-16 flex justify-end">
          <div className="w-full sm:max-w-md">
            <StepActions currentStep={1} />
          </div>
        </div>
      </div>
    </main>
  );
}
