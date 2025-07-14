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

export type BrandListParams = ProductCategoryParams;

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

export type Category = {
  id: string;
  name: string;
  image: string;
};

export type Brand = {
  id: string;
  name: string;
  categoryId: string;
};

export type ProductDetail = Record<string, Record<string, string>>;

export type Review = {
  rating: number; // 1-5
  comment: string;
  date: string;
  reviewerName: string;
};

export type Product = {
  id: string;
  name: string;
  images: string[];
  price: number;
  discountPercent: number;
  description: string;
  rating: number;
  shippingInfo: string;
  availability: 'in_stock' | 'out_of_stock' | 'preorder';
  warranty: string;
  relatedProductIds: string[];
  detailDescription: string;
  details: ProductDetail;
  reviews: Review[];
  brandId: string;
  categoryId: string;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isDiscount?: boolean;
};
