import { HttpClientResponse } from '@effect/platform';
import { Effect, Schema } from 'effect';

import { apiTransport } from '@/lib/api-client';
import { buildUrlWithParams } from '@/lib/url';
import type { BestsellerProductParams } from '@/types/api';
import { ProductSchema } from '@/types/api-schemas';

import { mapError } from './errors';

const ProductsSchema = Schema.mutable(Schema.Array(ProductSchema));

export const getBestsellers = Effect.fn('ProductApi.getBestsellers')((
  params?: BestsellerProductParams,
) => {
  const url = buildUrlWithParams('api/products/bestsellers', params);

  return apiTransport(url).pipe(
    Effect.flatMap((response) =>
      HttpClientResponse.schemaBodyJson(ProductsSchema)(response),
    ),
    Effect.mapError(mapError('getBestsellers')),
  );
});
