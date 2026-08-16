import type { Product } from '@/features/product/domain';

// Types for API requests
type PaginationParams = {
  page?: number;
  pageSize?: number;
};

type SortParams = {
  sort?: Sort;
};

type PriceFilterParams = {
  minPrice?: number;
  maxPrice?: number;
};

type ProductCategoryParams = {
  category?: string;
};

export type ProductLimitParams = {
  limit?: number;
};

type BrandFilterParams = {
  brands?: string | string[]; // comma-separated or array
};

export enum Sort {
  RATING_ASC = 'rating_asc',
  RATING_DESC = 'rating_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
}

export type ProductListParams = PaginationParams &
  SortParams &
  PriceFilterParams &
  BrandFilterParams &
  Required<ProductCategoryParams>;

export type SearchParams = PaginationParams &
  SortParams &
  PriceFilterParams &
  BrandFilterParams &
  ProductCategoryParams & {
    q: string;
  };

// Re-exported from brand repository — single source of truth
export type { FindAllParam as BrandListParams } from '@/features/brand/repository/brand-repository';

export type DiscountedProductParams = ProductCategoryParams &
  ProductLimitParams & {
    minDiscount?: number;
  };

export type FeaturedProductParams = ProductCategoryParams & ProductLimitParams;

export type BestsellerProductParams = ProductCategoryParams &
  ProductLimitParams;

export type NewArrivalProductParams = ProductCategoryParams &
  ProductLimitParams;

// Types for API responses
type PaginatedResponse<T> = {
  total: number;
  page: number;
  pageSize: number;
  products: T[];
};

export type ProductListResponse = PaginatedResponse<Product>;

export type SearchResponse = PaginatedResponse<Product> & {
  query: string;
};

// Domain re-exports — single source of truth lives in `features/*/domain`
export type { Brand } from '@/features/brand/domain';
export type { Category } from '@/features/category/domain';
export type { Product } from '@/features/product/domain';

export type ProductDetail = Record<string, Record<string, string>>;

export type Review = {
  rating: number; // 1-5
  comment: string;
  date: string;
  reviewerName: string;
};
