import { HttpClientError, HttpClientResponse } from '@effect/platform';
import { Context, Effect, Layer, Schema } from 'effect';

import { ApiClient } from '@/lib/api-client';
import { buildUrlWithParams } from '@/lib/url';
import type {
  BestsellerProductParams,
  DiscountedProductParams,
  FeaturedProductParams,
  NewArrivalProductParams,
  ProductListParams,
  ProductListResponse,
  SearchParams,
  SearchResponse,
} from '@/types/api';

import { Product } from '../domain';

class ProductNotFound extends Schema.TaggedError<ProductNotFound>(
  'ProductNotFoundError',
)('ProductNotFoundError', { productId: Schema.String }) {}

class UnexpectedError extends Schema.TaggedError<UnexpectedError>(
  'ProductRepositoryError',
)('ProductRepositoryError', {
  operation: Schema.String,
  cause: Schema.Defect,
}) {}

export type FindAllError = UnexpectedError;
export type FindByIdError = ProductNotFound | UnexpectedError;
export type SearchError = UnexpectedError;
export type FindRelatedError = ProductNotFound | UnexpectedError;

function mapFindByIdError(operation: string, productId: string) {
  return (error: unknown) =>
    error instanceof HttpClientError.ResponseError &&
    error.response.status === 404
      ? new ProductNotFound({ productId })
      : new UnexpectedError({ operation, cause: error });
}

function mapError(operation: string) {
  return (error: unknown) => new UnexpectedError({ operation, cause: error });
}

// Response schemas for list/search — decoded from Product domain
const ProductListResponseSchema: Schema.Schema<ProductListResponse> =
  Schema.Struct({
    total: Schema.Number,
    page: Schema.Number,
    pageSize: Schema.Number,
    products: Schema.mutable(Schema.Array(Product)),
  });

const SearchResponseSchema: Schema.Schema<SearchResponse> = Schema.Struct({
  total: Schema.Number,
  page: Schema.Number,
  pageSize: Schema.Number,
  products: Schema.mutable(Schema.Array(Product)),
  query: Schema.String,
});

const ProductsSchema = Schema.mutable(Schema.Array(Product));

type Interface = {
  findAll: (
    params: ProductListParams,
  ) => Effect.Effect<ProductListResponse, FindAllError>;
  findById: (id: string) => Effect.Effect<Product, FindByIdError>;
  findBestsellers: (
    params?: BestsellerProductParams,
  ) => Effect.Effect<Product[], FindAllError>;
  findDiscounted: (
    params?: DiscountedProductParams,
  ) => Effect.Effect<Product[], FindAllError>;
  findFeatured: (
    params?: FeaturedProductParams,
  ) => Effect.Effect<Product[], FindAllError>;
  findNewArrivals: (
    params?: NewArrivalProductParams,
  ) => Effect.Effect<Product[], FindAllError>;
  findRelated: (id: string) => Effect.Effect<Product[], FindRelatedError>;
  search: (params: SearchParams) => Effect.Effect<SearchResponse, SearchError>;
};

export class Service extends Context.Tag('ProductRepository')<
  Service,
  Interface
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const apiClient = yield* ApiClient.Service;

    return Service.of({
      findAll: Effect.fn('ProductRepository.findAll')(
        (params: ProductListParams) => {
          const url = buildUrlWithParams('api/products', params);

          return apiClient.get(url).pipe(
            Effect.flatMap((response) =>
              HttpClientResponse.schemaBodyJson(ProductListResponseSchema)(
                response,
              ),
            ),
            Effect.mapError(mapError('findAll')),
          );
        },
      ),
      findById: Effect.fn('ProductRepository.findById')((id: string) =>
        apiClient.get(`api/products/${id}`).pipe(
          Effect.flatMap((response) =>
            HttpClientResponse.schemaBodyJson(Product)(response),
          ),
          Effect.mapError(mapFindByIdError('findById', id)),
        ),
      ),
      findBestsellers: Effect.fn('ProductRepository.findBestsellers')(
        (params?: BestsellerProductParams) => {
          const url = buildUrlWithParams('api/products/bestsellers', params);

          return apiClient.get(url).pipe(
            Effect.flatMap((response) =>
              HttpClientResponse.schemaBodyJson(ProductsSchema)(response),
            ),
            Effect.mapError(mapError('findBestsellers')),
          );
        },
      ),
      findDiscounted: Effect.fn('ProductRepository.findDiscounted')(
        (params?: DiscountedProductParams) => {
          const url = buildUrlWithParams('api/products/discounted', params);

          return apiClient.get(url).pipe(
            Effect.flatMap((response) =>
              HttpClientResponse.schemaBodyJson(ProductsSchema)(response),
            ),
            Effect.mapError(mapError('findDiscounted')),
          );
        },
      ),
      findFeatured: Effect.fn('ProductRepository.findFeatured')(
        (params?: FeaturedProductParams) => {
          const url = buildUrlWithParams('api/products/featured', params);

          return apiClient.get(url).pipe(
            Effect.flatMap((response) =>
              HttpClientResponse.schemaBodyJson(ProductsSchema)(response),
            ),
            Effect.mapError(mapError('findFeatured')),
          );
        },
      ),
      findNewArrivals: Effect.fn('ProductRepository.findNewArrivals')(
        (params?: NewArrivalProductParams) => {
          const url = buildUrlWithParams('api/products/new-arrivals', params);

          return apiClient.get(url).pipe(
            Effect.flatMap((response) =>
              HttpClientResponse.schemaBodyJson(ProductsSchema)(response),
            ),
            Effect.mapError(mapError('findNewArrivals')),
          );
        },
      ),
      findRelated: Effect.fn('ProductRepository.findRelated')((id: string) =>
        apiClient.get(`api/products/${id}/related`).pipe(
          Effect.flatMap((response) =>
            HttpClientResponse.schemaBodyJson(ProductsSchema)(response),
          ),
          Effect.mapError(mapError('findRelated')),
        ),
      ),
      search: Effect.fn('ProductRepository.search')((params: SearchParams) => {
        const url = buildUrlWithParams('api/search', params);

        return apiClient.get(url).pipe(
          Effect.flatMap((response) =>
            HttpClientResponse.schemaBodyJson(SearchResponseSchema)(response),
          ),
          Effect.mapError(mapError('search')),
        );
      }),
    });
  }),
);

export const defaultLayer = layer.pipe(Layer.provide(ApiClient.defaultLayer));

export * as ProductRepository from './product-repository';
