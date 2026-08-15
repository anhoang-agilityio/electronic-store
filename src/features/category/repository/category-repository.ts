import { HttpClientError, HttpClientResponse } from '@effect/platform';
import { Context, Effect, Layer, Schema } from 'effect';

import { ApiClient } from '@/lib/api-client';

import { Category } from '../domain';

class CategoryNotFound extends Schema.TaggedError<CategoryNotFound>(
  'CategoryNotFoundError',
)('CategoryNotFoundError', { categoryId: Schema.String }) {}

class UnexpectedError extends Schema.TaggedError<UnexpectedError>(
  'CategoryRepositoryError',
)('CategoryRepositoryError', {
  operation: Schema.String,
  cause: Schema.Defect,
}) {}

export type FindAllError = UnexpectedError;
export type FindByIdError = CategoryNotFound | UnexpectedError;

function mapFindByIdError(operation: string, categoryId: string) {
  return (error: unknown) =>
    error instanceof HttpClientError.ResponseError &&
    error.response.status === 404
      ? new CategoryNotFound({ categoryId })
      : new UnexpectedError({ operation, cause: error });
}

function mapFindAllError(operation: string) {
  return (error: unknown) => new UnexpectedError({ operation, cause: error });
}

type Interface = {
  findAll: () => Effect.Effect<Category[], FindAllError>;
  findById: (id: string) => Effect.Effect<Category, FindByIdError>;
};

export class Service extends Context.Tag('CategoryRepository')<
  Service,
  Interface
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const apiClient = yield* ApiClient.Service;

    return Service.of({
      findAll: Effect.fn('CategoryRepository.findAll')(() =>
        apiClient.get('api/categories').pipe(
          Effect.flatMap((response) =>
            HttpClientResponse.schemaBodyJson(
              Schema.mutable(Schema.Array(Category)),
            )(response),
          ),
          Effect.mapError(mapFindAllError('findAll')),
        ),
      ),
      findById: Effect.fn('CategoryRepository.findById')((id) =>
        apiClient.get(`api/categories/${id}`).pipe(
          Effect.flatMap((response) =>
            HttpClientResponse.schemaBodyJson(Category)(response),
          ),
          Effect.mapError(mapFindByIdError('findById', id)),
        ),
      ),
    });
  }),
);

export const defaultLayer = layer.pipe(Layer.provide(ApiClient.defaultLayer));

export * as CategoryRepository from './category-repository';
