import { HttpClientResponse } from '@effect/platform';
import { Effect, Schema } from 'effect';

import { apiTransport } from '@/lib/http-client';
import { buildUrlWithParams } from '@/lib/url';
import type { NewArrivalProductParams } from '@/types/api';
import { ProductSchema } from '@/types/api-schemas';

import { mapError } from './errors';

const ProductsSchema = Schema.mutable(Schema.Array(ProductSchema));

export const getNewArrivals = Effect.fn('ProductApi.getNewArrivals')((
  params?: NewArrivalProductParams,
) => {
  const url = buildUrlWithParams('api/products/new-arrivals', params);

  return apiTransport(url).pipe(
    Effect.flatMap((response) =>
      HttpClientResponse.schemaBodyJson(ProductsSchema)(response),
    ),
    Effect.mapError(mapError('getNewArrivals')),
  );
});
