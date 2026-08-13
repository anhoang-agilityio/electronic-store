import { Schema } from 'effect';

import type {
  Brand,
  Category,
  Product,
  ProductListResponse,
  SearchResponse,
} from '@/types/api';

export const CategorySchema: Schema.Schema<Category> = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  image: Schema.String,
});

export const BrandSchema: Schema.Schema<Brand> = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  categoryId: Schema.String,
});

const ReviewSchema = Schema.Struct({
  rating: Schema.Number,
  comment: Schema.String,
  date: Schema.String,
  reviewerName: Schema.String,
});

const ProductDetailSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Record({ key: Schema.String, value: Schema.String }),
});

export const ProductSchema: Schema.Schema<Product> = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  images: Schema.mutable(Schema.Array(Schema.String)),
  price: Schema.Number,
  discountPercent: Schema.Number,
  description: Schema.String,
  rating: Schema.Number,
  shippingInfo: Schema.String,
  availability: Schema.Literal('in_stock', 'out_of_stock', 'preorder'),
  warranty: Schema.String,
  relatedProductIds: Schema.mutable(Schema.Array(Schema.String)),
  detailDescription: Schema.String,
  details: ProductDetailSchema,
  reviews: Schema.mutable(Schema.Array(ReviewSchema)),
  brandId: Schema.String,
  categoryId: Schema.String,
  isNewArrival: Schema.optional(Schema.Boolean),
  isBestseller: Schema.optional(Schema.Boolean),
  isFeatured: Schema.optional(Schema.Boolean),
  isDiscount: Schema.optional(Schema.Boolean),
});

export const ProductListResponseSchema: Schema.Schema<ProductListResponse> =
  Schema.Struct({
    total: Schema.Number,
    page: Schema.Number,
    pageSize: Schema.Number,
    products: Schema.mutable(Schema.Array(ProductSchema)),
  });

export const SearchResponseSchema: Schema.Schema<SearchResponse> =
  Schema.Struct({
    total: Schema.Number,
    page: Schema.Number,
    pageSize: Schema.Number,
    products: Schema.mutable(Schema.Array(ProductSchema)),
    query: Schema.String,
  });
