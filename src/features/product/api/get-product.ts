import { HttpClientResponse } from '@effect/platform';
import { Effect } from 'effect';

import { apiTransport } from '@/lib/http-client';
import { ProductSchema } from '@/types/api-schemas';

import { mapError } from './errors';

export const getProduct = Effect.fn('ProductApi.getProduct')((id: string) =>
  apiTransport(`api/products/${id}`).pipe(
    Effect.flatMap((response) =>
      HttpClientResponse.schemaBodyJson(ProductSchema)(response),
    ),
    Effect.mapError(mapError('getProduct', id)),
  ),
);
