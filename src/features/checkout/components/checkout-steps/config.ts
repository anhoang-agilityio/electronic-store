import { CreditCard, MapPin, Truck } from 'lucide-react';

export type StepItem = {
  icon: React.ComponentType<{ className?: string }>;
  stepNumber: number;
  title: string;
};

export const steps: StepItem[] = [
  { icon: MapPin, title: 'Address', stepNumber: 1 },
  { icon: Truck, title: 'Shipping', stepNumber: 2 },
  { icon: CreditCard, title: 'Payment', stepNumber: 3 },
];
