import { api, buildUrlWithParams } from '@/lib/api-client';
import type { Category } from '@/types/api';

export async function getCategories(options?: RequestInit) {
  const url = buildUrlWithParams('api/categories');
  return await api.get<Category[]>(url, options);
}
