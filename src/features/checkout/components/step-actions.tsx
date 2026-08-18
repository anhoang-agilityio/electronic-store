'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { paths } from '@/config/paths';
import { useCurrentCheckout } from '@/features/checkout/hooks/use-checkout';
import { useCheckoutActions } from '@/features/checkout/hooks/use-checkout-actions';

type ValidStep = 1 | 2 | 3;

type StepActionsProps = {
  currentStep: ValidStep;
  onPaySubmit?: () => void;
};

export function StepActions({ currentStep, onPaySubmit }: StepActionsProps) {
  const router = useRouter();
  const formContext = useFormContext();
  const { completeCheckout } = useCheckoutActions();
  const checkout = useCurrentCheckout();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [payLoading, setPayLoading] = React.useState(false);

  const hasProducts = (checkout?.products.length ?? 0) > 0;
  const hasAddress = Boolean(checkout?.address);
  const hasShipping = Boolean(checkout?.shipment);

  function handleBack() {
    if (currentStep === 1) {
      router.push(paths.cart.getHref());
    } else {
      router.push(
        paths.checkout.step((currentStep - 1) as ValidStep).getHref(),
      );
    }
  }

  function handleNext() {
    if (currentStep < 3) {
      router.push(
        paths.checkout.step((currentStep + 1) as ValidStep).getHref(),
      );
    }
  }

  function handlePay() {
    onPaySubmit?.();
    setConfirmOpen(true);
  }

  function handleConfirmPay() {
    setPayLoading(true);
    setTimeout(() => {
      void completeCheckout().then((completed) => {
        if (!completed) return;

        setPayLoading(false);
        setConfirmOpen(false);
        toast.success('Payment successful!');
        router.push(paths.home.getHref());
      });
    }, 600);
  }

  let nextDisabled = false;
  if (currentStep === 1) {
    nextDisabled = !hasProducts || !hasAddress;
  } else if (currentStep === 2) {
    nextDisabled = !hasProducts || !hasAddress || !hasShipping;
  }

  const payDisabled =
    !hasProducts ||
    !hasAddress ||
    !hasShipping ||
    (currentStep === 3 && !formContext.formState.isValid);

  return (
    <div className="w-full flex gap-6 justify-end">
      <Button
        variant="outline"
        size="xl"
        onClick={handleBack}
        className="flex-1"
      >
        Back
      </Button>
      {currentStep < 3 ? (
        <Button
          size="xl"
          onClick={handleNext}
          className="flex-1"
          disabled={nextDisabled}
        >
          Next
        </Button>
      ) : (
        <>
          <Button
            size="xl"
            onClick={handlePay}
            className="flex-1"
            disabled={payDisabled}
          >
            Pay
          </Button>
          <ConfirmationDialog
            open={confirmOpen}
            title="Confirm Payment"
            description="Are you sure you want to pay and place this order?"
            confirmText="Pay"
            cancelText="Cancel"
            onConfirm={handleConfirmPay}
            onCancel={() => setConfirmOpen(false)}
            loading={payLoading}
            disabled={payLoading}
          />
        </>
      )}
    </div>
  );
}
