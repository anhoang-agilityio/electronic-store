import { api, buildUrlWithParams } from '@/lib/api-client';
import type { Category } from '@/types/api';

export async function getCategory(id: string, options?: RequestInit) {
  const url = buildUrlWithParams(`api/categories/${id}`);
  return await api.get<Category>(url, options);
}
