import { HttpClientResponse } from '@effect/platform';
import { Effect, Schema } from 'effect';

import { apiTransport } from '@/lib/http-client';
import { buildUrlWithParams } from '@/lib/url';
import type { FeaturedProductParams } from '@/types/api';
import { ProductSchema } from '@/types/api-schemas';

import { mapError } from './errors';

const ProductsSchema = Schema.mutable(Schema.Array(ProductSchema));

export const getFeaturedProducts = Effect.fn('ProductApi.getFeaturedProducts')((
  params?: FeaturedProductParams,
) => {
  const url = buildUrlWithParams('api/products/featured', params);

  return apiTransport(url).pipe(
    Effect.flatMap((response) =>
      HttpClientResponse.schemaBodyJson(ProductsSchema)(response),
    ),
    Effect.mapError(mapError('getFeaturedProducts')),
  );
});
