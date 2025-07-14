import React from 'react';

import { cn } from '@/lib/utils';

import type { StepItem } from './config';

export type CheckoutStepProps = StepItem & {
  isActive?: boolean;
};

export function CheckoutStep({
  icon: Icon,
  stepNumber,
  title,
  isActive = false,
}: CheckoutStepProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Icon with circular background */}
      <div
        className={cn(
          'flex items-center justify-center size-6 rounded-full',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted-foreground text-muted',
        )}
      >
        <Icon className="size-3" />
      </div>

      {/* Text content */}
      <div className="flex flex-col">
        <span
          className={cn(
            'text-sm font-medium',
            isActive ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          Step {stepNumber}
        </span>
        <span
          className={cn(
            'text-xl font-medium',
            isActive ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {title}
        </span>
      </div>
    </div>
  );
}
