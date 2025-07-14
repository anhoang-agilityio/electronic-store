'use client';

import { usePathname } from 'next/navigation';

import { CheckoutStepLayout } from '@/features/checkout/components/checkout-steps';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  let currentStep = 1;

  if (pathname?.includes('step-2')) {
    currentStep = 2;
  } else if (pathname?.includes('step-3')) {
    currentStep = 3;
  }

  return (
    <CheckoutStepLayout currentStep={currentStep}>
      {children}
    </CheckoutStepLayout>
  );
}
