import { api, buildUrlWithParams } from '@/lib/api-client';
import type { BrandListParams, Brand } from '@/types/api';

export async function getBrands(
  params?: BrandListParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/brands', params);
  return await api.get<Brand[]>(url, options);
}
