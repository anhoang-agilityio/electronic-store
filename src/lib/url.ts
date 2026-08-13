export type QueryParams = Record<
  string,
  undefined | null | string | number | boolean | (string | number | boolean)[]
>;

export function buildUrlWithParams(
  baseUrl: string,
  params?: QueryParams,
): string {
  if (!params) {
    return baseUrl;
  }

  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === '' || value === undefined || value === null) {
      continue;
    }

    query.set(key, Array.isArray(value) ? value.join(',') : String(value));
  }

  const queryString = query.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
