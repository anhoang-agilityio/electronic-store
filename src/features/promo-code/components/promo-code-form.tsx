'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrentCheckout, useUserStore } from '@/stores/user-store';

import { applyPromoCode } from '../api/apply-promo-code';
import { isKnownPromoCode } from '../data/promo-codes';

export function PromoCodeForm() {
  const checkout = useCurrentCheckout();
  const setCheckoutPromoCode = useUserStore((s) => s.setCheckoutPromoCode);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const appliedPromoCode = checkout?.promoCode;

  const handleApply = () => {
    setError('');

    // Skip the request for codes that do not exist
    if (!isKnownPromoCode(code)) {
      setError('This promo code does not exist.');
      return;
    }

    startTransition(async () => {
      try {
        const result = await applyPromoCode({
          code,
          items: (checkout?.products ?? []).map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        });
        setCheckoutPromoCode({ code: result.code, discount: result.discount });
        setCode('');
        toast.success(`Promo code "${result.code}" applied!`);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to apply promo code.',
        );
      }
    });
  };

  if (appliedPromoCode) {
    return (
      <div className="flex items-center justify-between rounded-md border px-4 py-3">
        <span className="text-sm">
          Promo code{' '}
          <span className="font-medium">{appliedPromoCode.code}</span> applied
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCheckoutPromoCode(null)}
        >
          Remove
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        handleApply();
      }}
    >
      <div className="flex gap-2">
        <Input
          placeholder="Promo code"
          value={code}
          disabled={isPending}
          aria-invalid={!!error}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button type="submit" disabled={isPending || !code.trim()}>
          {isPending ? 'Applying...' : 'Apply'}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
