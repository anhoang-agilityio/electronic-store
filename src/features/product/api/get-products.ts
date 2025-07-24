import { api, buildUrlWithParams } from '@/lib/api-client';
import type { ProductListParams, ProductListResponse } from '@/types/api';

export async function getProducts(
  params: ProductListParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/products', params);
  return await api.get<ProductListResponse>(url, options);
}
