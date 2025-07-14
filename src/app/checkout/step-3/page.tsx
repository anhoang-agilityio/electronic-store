import { CheckoutPaymentPanel } from '@/features/checkout/components/checkout-payment-panel';
import { CheckoutSummaryPanel } from '@/features/checkout/components/checkout-summary-panel';

export default function CheckoutStep3Page() {
  return (
    <main className="pt-6 pb-18">
      <div className="mx-auto max-w-7xl px-4 flex flex-col gap-4 md:flex-row md:gap-10">
        <CheckoutSummaryPanel />
        <CheckoutPaymentPanel />
      </div>
    </main>
  );
}
