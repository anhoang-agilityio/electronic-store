import { api, buildUrlWithParams } from '@/lib/api-client';
import type { Product, DiscountedProductParams } from '@/types/api';

export async function getDiscountedProducts(
  params?: DiscountedProductParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/products/discounted', params);
  return await api.get<Product[]>(url, options);
}
