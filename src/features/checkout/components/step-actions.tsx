'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { paths } from '@/config/paths';
import { useUserStore, useCurrentCheckout } from '@/stores/user-store';

type ValidStep = 1 | 2 | 3;

type StepActionsProps = {
  currentStep: ValidStep;
  onPaySubmit?: () => void;
};

export function StepActions({ currentStep, onPaySubmit }: StepActionsProps) {
  const router = useRouter();
  // Only use its value for step 3
  const formContext = useFormContext();

  const clearCheckout = useUserStore((s) => s.clearCheckout);
  const clearCart = useUserStore((s) => s.clearCart);
  const placeOrder = useUserStore((s) => s.placeOrder);
  const payInFlight = React.useRef(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [payLoading, setPayLoading] = React.useState(false);

  const checkout = useCurrentCheckout();
  const checkoutProducts = checkout?.products ?? [];
  const checkoutAddress = checkout?.address;
  const checkoutShipping = checkout?.shipment;

  const hasProducts = checkoutProducts.length > 0;
  const hasAddress = !!checkoutAddress;
  const hasShipping = !!checkoutShipping;

  // Handle Back button click
  function handleBack() {
    if (currentStep === 1) {
      router.push(paths.cart.getHref());
    } else if (currentStep > 1) {
      router.push(
        paths.checkout.step((currentStep - 1) as ValidStep).getHref(),
      );
    }
  }

  // Handle Next button click
  function handleNext() {
    if (currentStep < 3) {
      router.push(
        paths.checkout.step((currentStep + 1) as ValidStep).getHref(),
      );
    }
  }

  // Handle Pay button click (submit form first)
  function handlePay() {
    if (onPaySubmit) onPaySubmit();
    setConfirmOpen(true);
  }

  // Confirm payment: create the order, clear checkout & cart, then show it
  function handleConfirmPay() {
    // Ref guard: state updates are async, so a fast double-click could slip past payLoading
    if (payLoading || payInFlight.current) return;
    payInFlight.current = true;
    setPayLoading(true);
    setTimeout(() => {
      const order = placeOrder();
      payInFlight.current = false;
      setPayLoading(false);

      if (!order) {
        // Keep the dialog open and leave checkout/cart untouched
        toast.error('Could not place your order. Please try again.');
        return;
      }

      clearCheckout();
      // Checkout always holds the whole cart (see CartSummary), so clearing it all is correct
      clearCart();
      setConfirmOpen(false);
      toast.success('Payment successful!');
      // replace: Back must not land on an emptied checkout step 3
      router.replace(`${paths.orders.detail(order.id).getHref()}?placed=1`);
    }, 600); // Simulate processing
  }

  // Disable conditions for each step
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
    (currentStep === 3 ? !formContext.formState.isValid : false);

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
