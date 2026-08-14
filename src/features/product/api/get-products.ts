import { HttpClientResponse } from '@effect/platform';
import { Effect } from 'effect';

import { apiTransport } from '@/lib/api-client';
import { buildUrlWithParams } from '@/lib/url';
import type { ProductListParams } from '@/types/api';
import { ProductListResponseSchema } from '@/types/api-schemas';

import { mapError } from './errors';

export const getProducts = Effect.fn('ProductApi.getProducts')((
  params: ProductListParams,
) => {
  const url = buildUrlWithParams('api/products', params);

  return apiTransport(url).pipe(
    Effect.flatMap((response) =>
      HttpClientResponse.schemaBodyJson(ProductListResponseSchema)(response),
    ),
    Effect.mapError(mapError('getProducts')),
  );
});
