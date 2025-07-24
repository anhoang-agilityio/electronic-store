import { env } from '@/config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public url: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(path: string, options: RequestInit = {}) {
  const { headers, body, ...rest } = options;
  const url = new URL(path, env.API_URL);

  const response = await fetch(url, {
    headers: {
      'X-API-Key': env.API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!response.ok) {
    let errorMessage: string;

    try {
      const errorData = (await response.json()) as Record<string, unknown>;
      errorMessage =
        (errorData?.error as string) ??
        (errorData?.message as string) ??
        `HTTP ${response.status}: ${response.statusText}`;
    } catch {
      // If response is not JSON, use status text or fallback
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }

    throw new ApiError(
      errorMessage,
      response.status,
      response.statusText,
      url.toString(),
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  get<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'GET' });
  },
  post<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'POST' });
  },
  put<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'PUT' });
  },
  patch<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'PATCH' });
  },
  delete<T>(url: string, options?: RequestInit): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'DELETE' });
  },
};

// Helper function to build URL with parameters
export function buildUrlWithParams(
  baseUrl: string,
  params?: Record<
    string,
    undefined | null | string | number | boolean | (string | number | boolean)[]
  >,
): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== '' && value !== undefined && value !== null,
    ),
  );

  if (Object.keys(filteredParams).length === 0) {
    return baseUrl;
  }

  const processedParams = Object.fromEntries(
    Object.entries(filteredParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(',') : value,
    ]),
  );

  const queryString = new URLSearchParams(
    processedParams as Record<string, string>,
  ).toString();

  return `${baseUrl}?${queryString}`;
}
