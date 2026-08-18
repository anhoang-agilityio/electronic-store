'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCheckoutActions } from '@/features/checkout/hooks/use-checkout-actions';

import { StepActions } from './step-actions';

const creditCardInfoSchema = z.object({
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  cardNumber: z.string().regex(/^[0-9]{10}$/, 'Card number must be 10 digits'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/(\d{2})$/, 'Format MM/YY'),
  cvv: z.string().regex(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits'),
});

type CreditCardFormValues = z.infer<typeof creditCardInfoSchema>;

export function CheckoutPaymentPanel() {
  const methods = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardInfoSchema),
    mode: 'onTouched',
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });
  const { setCreditCard } = useCheckoutActions();

  const handleCreditCardSubmit = (data: CreditCardFormValues) => {
    void setCreditCard(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-10 w-full p-8">
        <h1 className="font-bold text-xl">Payment</h1>
        <Image
          src="/credit-card.png"
          alt="Credit Card"
          width={337}
          height={190}
          className="object-cover rounded-lg"
        />
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="border rounded-md flex flex-col px-4 h-12 justify-center">
            <input
              type="text"
              placeholder="Cardholder Name"
              className="w-full outline-none placeholder:text-muted-foreground"
              {...methods.register('cardholderName')}
            />
            {methods.formState.errors.cardholderName && (
              <span className="text-destructive text-xs mt-1">
                {methods.formState.errors.cardholderName.message}
              </span>
            )}
          </div>
          <div className="border rounded-md flex flex-col px-4 h-12 justify-center">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full outline-none placeholder:text-muted-foreground"
              {...methods.register('cardNumber')}
            />
            {methods.formState.errors.cardNumber && (
              <span className="text-destructive text-xs mt-1">
                {methods.formState.errors.cardNumber.message}
              </span>
            )}
          </div>
          <div className="flex gap-4">
            <div className="border rounded-md flex flex-col px-4 h-12 w-1/2 justify-center">
              <input
                type="text"
                placeholder="Exp.Date"
                className="w-full outline-none placeholder:text-muted-foreground"
                {...methods.register('expiryDate')}
              />
              {methods.formState.errors.expiryDate && (
                <span className="text-destructive text-xs mt-1">
                  {methods.formState.errors.expiryDate.message}
                </span>
              )}
            </div>
            <div className="border rounded-md flex flex-col px-4 h-12 w-1/2 justify-center">
              <input
                type="text"
                placeholder="CVV"
                className="w-full outline-none placeholder:text-muted-foreground"
                {...methods.register('cvv')}
              />
              {methods.formState.errors.cvv && (
                <span className="text-destructive text-xs mt-1">
                  {methods.formState.errors.cvv.message}
                </span>
              )}
            </div>
          </div>
        </form>
        <div className="mt-8">
          <StepActions
            currentStep={3}
            onPaySubmit={() => {
              void methods.handleSubmit(handleCreditCardSubmit)();
            }}
          />
        </div>
      </div>
    </FormProvider>
  );
}
