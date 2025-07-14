import * as React from 'react';

import { searchProducts } from '@/api/api-client';
import type { SearchParams, Product } from '@/types/api';

export type UseSearchProductOptions = {
  pageSize?: number;
  onError?: (error: unknown) => void;
};

export type UseSearchProductReturn = {
  searchResults: Product[];
  isPending: boolean;
  search: (query: string) => void;
};

export function useSearchProduct(
  options: UseSearchProductOptions = {},
): UseSearchProductReturn {
  const { pageSize = 10, onError } = options;

  const [searchResults, setSearchResults] = React.useState<Product[]>([]);
  const [isPending, startTransition] = React.useTransition();

  // Search function
  const performSearch = React.useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const searchParams: SearchParams = {
          q: query.trim(),
          page: 1,
          pageSize,
        };

        const response = await searchProducts(searchParams);
        setSearchResults(response.products);
      } catch (error) {
        if (onError) {
          onError(error);
        }
        setSearchResults([]);
      }
    },
    [pageSize, onError],
  );

  const search = React.useCallback(
    (query: string) => {
      startTransition(async () => {
        await performSearch(query);
      });
    },
    [performSearch],
  );

  return {
    searchResults,
    isPending,
    search,
  };
}
