import { api, buildUrlWithParams } from '@/lib/api-client';
import type { Product } from '@/types/api';

export async function getProduct(id: string, options?: RequestInit) {
  const url = buildUrlWithParams(`api/products/${id}`);
  return await api.get<Product>(url, options);
}
