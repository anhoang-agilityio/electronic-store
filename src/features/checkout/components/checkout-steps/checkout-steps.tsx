import React from 'react';

import { CheckoutStep } from './checkout-step';
import type { StepItem } from './config';

type CheckoutStepsProps = {
  currentStep?: number;
  steps: StepItem[];
};

export function CheckoutSteps({ currentStep = 1, steps }: CheckoutStepsProps) {
  return (
    <nav
      aria-label="Checkout steps"
      className="flex items-center justify-evenly sm:justify-between gap-12"
    >
      {steps.map((step) => (
        <CheckoutStep
          key={step.stepNumber}
          icon={step.icon}
          stepNumber={step.stepNumber}
          title={step.title}
          isActive={step.stepNumber === currentStep}
        />
      ))}
    </nav>
  );
}
