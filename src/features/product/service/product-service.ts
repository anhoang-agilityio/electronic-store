import { Context, Effect, Layer } from 'effect';

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

import type { Product } from '../domain';
import { ProductRepository } from '../repository/product-repository';

type GetProductsError = ProductRepository.FindAllError;
type GetProductError = ProductRepository.FindByIdError;
type GetRelatedProductsError = ProductRepository.FindRelatedError;
type SearchProductsError = ProductRepository.SearchError;

type Interface = {
  getProducts: (
    params: ProductListParams,
  ) => Effect.Effect<ProductListResponse, GetProductsError>;
  getProduct: (id: string) => Effect.Effect<Product, GetProductError>;
  getBestsellers: (
    params?: BestsellerProductParams,
  ) => Effect.Effect<Product[], GetProductsError>;
  getDiscountedProducts: (
    params?: DiscountedProductParams,
  ) => Effect.Effect<Product[], GetProductsError>;
  getFeaturedProducts: (
    params?: FeaturedProductParams,
  ) => Effect.Effect<Product[], GetProductsError>;
  getNewArrivals: (
    params?: NewArrivalProductParams,
  ) => Effect.Effect<Product[], GetProductsError>;
  getRelatedProducts: (
    id: string,
  ) => Effect.Effect<Product[], GetRelatedProductsError>;
  searchProducts: (
    params: SearchParams,
  ) => Effect.Effect<SearchResponse, SearchProductsError>;
};

export class Service extends Context.Tag('ProductService')<
  Service,
  Interface
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const productRepository = yield* ProductRepository.Service;

    return Service.of({
      getProducts: Effect.fn('ProductService.getProducts')((params) =>
        productRepository.findAll(params),
      ),
      getProduct: Effect.fn('ProductService.getProduct')((id) =>
        productRepository.findById(id),
      ),
      getBestsellers: Effect.fn('ProductService.getBestsellers')((params) =>
        productRepository.findBestsellers(params),
      ),
      getDiscountedProducts: Effect.fn('ProductService.getDiscountedProducts')(
        (params) => productRepository.findDiscounted(params),
      ),
      getFeaturedProducts: Effect.fn('ProductService.getFeaturedProducts')(
        (params) => productRepository.findFeatured(params),
      ),
      getNewArrivals: Effect.fn('ProductService.getNewArrivals')((params) =>
        productRepository.findNewArrivals(params),
      ),
      getRelatedProducts: Effect.fn('ProductService.getRelatedProducts')((id) =>
        productRepository.findRelated(id),
      ),
      searchProducts: Effect.fn('ProductService.searchProducts')((params) =>
        productRepository.search(params),
      ),
    });
  }),
);

export const defaultLayer = layer.pipe(
  Layer.provide(ProductRepository.defaultLayer),
);

export * as ProductService from './product-service';
