import { Effect } from 'effect';
import * as React from 'react';

import { searchProducts } from '@/features/product/api/search-products';
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

      const searchParams: SearchParams = {
        q: query.trim(),
        page: 1,
        pageSize,
      };

      await Effect.runPromise(
        searchProducts(searchParams).pipe(
          Effect.match({
            onFailure: (error) => {
              onError?.(error);
              setSearchResults([]);
            },
            onSuccess: (response) => setSearchResults(response.products),
          }),
        ),
      );
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
