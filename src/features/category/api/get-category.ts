import { HttpClientResponse } from '@effect/platform';
import { Effect } from 'effect';

import { apiTransport } from '@/lib/http-client';
import { CategorySchema } from '@/types/api-schemas';

import { mapError } from './errors';

export const getCategory = Effect.fn('CategoryApi.getCategory')((id: string) =>
  apiTransport(`api/categories/${id}`).pipe(
    Effect.flatMap((response) =>
      HttpClientResponse.schemaBodyJson(CategorySchema)(response),
    ),
    Effect.mapError(mapError('getCategory', id)),
  ),
);
