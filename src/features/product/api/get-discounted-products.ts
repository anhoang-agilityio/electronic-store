import { HttpClientResponse } from '@effect/platform';
import { Effect, Schema } from 'effect';

import { apiTransport } from '@/lib/api-client';
import { buildUrlWithParams } from '@/lib/url';
import type { DiscountedProductParams } from '@/types/api';
import { ProductSchema } from '@/types/api-schemas';

import { mapError } from './errors';

const ProductsSchema = Schema.mutable(Schema.Array(ProductSchema));

export const getDiscountedProducts = Effect.fn(
  'ProductApi.getDiscountedProducts',
)((params?: DiscountedProductParams) => {
  const url = buildUrlWithParams('api/products/discounted', params);

  return apiTransport(url).pipe(
    Effect.flatMap((response) =>
      HttpClientResponse.schemaBodyJson(ProductsSchema)(response),
    ),
    Effect.mapError(mapError('getDiscountedProducts')),
  );
});
