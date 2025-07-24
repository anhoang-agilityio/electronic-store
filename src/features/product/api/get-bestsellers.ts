import { api, buildUrlWithParams } from '@/lib/api-client';
import type { Product, BestsellerProductParams } from '@/types/api';

export async function getBestsellers(
  params?: BestsellerProductParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/products/bestsellers', params);
  return await api.get<Product[]>(url, options);
}
