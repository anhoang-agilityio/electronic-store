import { api, buildUrlWithParams } from '@/lib/api-client';
import type { SearchParams, SearchResponse } from '@/types/api';

export async function searchProducts(
  params: SearchParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/search', params);
  return await api.get<SearchResponse>(url, options);
}
