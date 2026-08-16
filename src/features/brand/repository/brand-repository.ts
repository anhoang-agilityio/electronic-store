import { HttpClientResponse } from '@effect/platform';
import { Context, Effect, Layer, Schema } from 'effect';

import { ApiClient } from '@/lib/api-client';
import { buildUrlWithParams } from '@/lib/url';

import { Brand } from '../domain';

export type FindAllParam = {
  category?: string;
};

class UnexpectedError extends Schema.TaggedError<UnexpectedError>(
  'BrandRepositoryError',
)('BrandRepositoryError', {
  operation: Schema.String,
  cause: Schema.Defect,
}) {}

export type FindAllError = UnexpectedError;

function mapFindAllError(operation: string) {
  return (error: unknown) => new UnexpectedError({ operation, cause: error });
}

type Interface = {
  findAll: (params?: FindAllParam) => Effect.Effect<Brand[], FindAllError>;
};

export class Service extends Context.Tag('BrandRepository')<
  Service,
  Interface
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const apiClient = yield* ApiClient.Service;

    return Service.of({
      findAll: Effect.fn('BrandRepository.findAll')((params?: FindAllParam) => {
        const url = buildUrlWithParams('api/brands', params);

        return apiClient.get(url).pipe(
          Effect.flatMap((response) =>
            HttpClientResponse.schemaBodyJson(
              Schema.mutable(Schema.Array(Brand)),
            )(response),
          ),
          Effect.mapError(mapFindAllError('findAll')),
        );
      }),
    });
  }),
);

export const defaultLayer = layer.pipe(Layer.provide(ApiClient.defaultLayer));

export * as BrandRepository from './brand-repository';
