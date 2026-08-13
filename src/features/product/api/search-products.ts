import { HttpClientResponse } from '@effect/platform';
import { Effect } from 'effect';

import { apiTransport } from '@/lib/http-client';
import { buildUrlWithParams } from '@/lib/url';
import type { SearchParams } from '@/types/api';
import { SearchResponseSchema } from '@/types/api-schemas';

import { mapError } from './errors';

export const searchProducts = Effect.fn('ProductApi.searchProducts')((
  params: SearchParams,
) => {
  const url = buildUrlWithParams('api/search', params);

  return apiTransport(url).pipe(
    Effect.flatMap((response) =>
      HttpClientResponse.schemaBodyJson(SearchResponseSchema)(response),
    ),
    Effect.mapError(mapError('searchProducts')),
  );
});
