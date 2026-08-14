import { HttpClientResponse } from '@effect/platform';
import { Effect, Schema } from 'effect';

import { apiTransport } from '@/lib/api-client';
import { ProductSchema } from '@/types/api-schemas';

import { mapError } from './errors';

const ProductsSchema = Schema.mutable(Schema.Array(ProductSchema));

export const getRelatedProducts = Effect.fn('ProductApi.getRelatedProducts')(
  (id: string) =>
    apiTransport(`api/products/${id}/related`).pipe(
      Effect.flatMap((response) =>
        HttpClientResponse.schemaBodyJson(ProductsSchema)(response),
      ),
      Effect.mapError(mapError('getRelatedProducts')),
    ),
);
