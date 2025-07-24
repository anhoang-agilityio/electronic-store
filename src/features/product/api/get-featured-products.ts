import { api, buildUrlWithParams } from '@/lib/api-client';
import type { Product, FeaturedProductParams } from '@/types/api';

export async function getFeaturedProducts(
  params?: FeaturedProductParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/products/featured', params);
  return await api.get<Product[]>(url, options);
}
