import { api, buildUrlWithParams } from '@/lib/api-client';
import type { Product } from '@/types/api';

export async function getRelatedProducts(id: string, options?: RequestInit) {
  const url = buildUrlWithParams(`api/products/${id}/related`);
  return await api.get<Product[]>(url, options);
}
