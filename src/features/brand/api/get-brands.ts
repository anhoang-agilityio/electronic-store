import { HttpClientResponse } from '@effect/platform';
import { Effect, Schema } from 'effect';

import { apiTransport } from '@/lib/api-client';
import { buildUrlWithParams } from '@/lib/url';
import type { BrandListParams } from '@/types/api';
import { BrandSchema } from '@/types/api-schemas';

import { BrandApiError } from './errors';

const BrandsSchema = Schema.mutable(Schema.Array(BrandSchema));

export const getBrands = Effect.fn('BrandApi.getBrands')((
  params?: BrandListParams,
) => {
  const url = buildUrlWithParams('api/brands', params);

  return apiTransport(url).pipe(
    Effect.flatMap((response) =>
      HttpClientResponse.schemaBodyJson(BrandsSchema)(response),
    ),
    Effect.mapError(
      (cause) => new BrandApiError({ operation: 'getBrands', cause }),
    ),
  );
});
