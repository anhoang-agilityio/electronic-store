import type {
  ApplyPromoCodeRequest,
  ApplyPromoCodeResponse,
} from '@/types/api';

export async function applyPromoCode(body: ApplyPromoCodeRequest) {
  const response = await fetch('/api/checkout/promo-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as
    | ApplyPromoCodeResponse
    | { error?: string };

  if (!response.ok) {
    const message = 'error' in data ? data.error : undefined;
    throw new Error(message ?? 'Failed to apply promo code.');
  }

  return data as ApplyPromoCodeResponse;
}
