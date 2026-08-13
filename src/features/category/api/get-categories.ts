import { HttpClientResponse } from '@effect/platform';
import { Effect, Schema } from 'effect';

import { apiTransport } from '@/lib/http-client';
import { CategorySchema } from '@/types/api-schemas';

import { mapError } from './errors';

const CategoriesSchema = Schema.mutable(Schema.Array(CategorySchema));

export const getCategories = Effect.fn('CategoryApi.getCategories')(() =>
  apiTransport('api/categories').pipe(
    Effect.flatMap((response) =>
      HttpClientResponse.schemaBodyJson(CategoriesSchema)(response),
    ),
    Effect.mapError(mapError('getCategories')),
  ),
);
