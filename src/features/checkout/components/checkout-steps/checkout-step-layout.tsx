import React from 'react';

import { CheckoutSteps } from './checkout-steps';
import { steps } from './config';

type CheckoutStepLayoutProps = {
  children: React.ReactNode;
  currentStep?: number;
};

export function CheckoutStepLayout({
  children,
  currentStep = 1,
}: CheckoutStepLayoutProps) {
  // Mobile: show [1,2] if currentStep=1, show [2,3] if currentStep=2|3
  const mobileSteps = currentStep === 1 ? [1, 2] : [2, 3];

  return (
    <>
      <section className="py-18">
        {/* Mobile: only show 2 steps, Desktop: always show 3 steps */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="sm:hidden">
            <CheckoutSteps
              currentStep={currentStep}
              steps={steps.filter((s) => mobileSteps.includes(s.stepNumber))}
            />
          </div>
          <div className="hidden sm:block">
            <CheckoutSteps currentStep={currentStep} steps={steps} />
          </div>
        </div>
      </section>
      {children}
    </>
  );
}
