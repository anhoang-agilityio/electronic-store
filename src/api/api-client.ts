import type {
  ProductListParams,
  BrandListParams,
  Product,
  Category,
  Brand,
  ProductListResponse,
  FeaturedProductParams,
  BestsellerProductParams,
  NewArrivalProductParams,
  DiscountedProductParams,
  SearchParams,
  SearchResponse,
} from '@/types/api';

import { api, buildUrlWithParams } from './utils';

// Products
export async function getProducts(
  params: ProductListParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/products', params);
  return await api.get<ProductListResponse>(url, options);
}

export async function getProduct(id: string, options?: RequestInit) {
  const url = buildUrlWithParams(`api/products/${id}`);
  return await api.get<Product>(url, options);
}

export async function getRelatedProducts(id: string, options?: RequestInit) {
  const url = buildUrlWithParams(`api/products/${id}/related`);
  return await api.get<Product[]>(url, options);
}

export async function getFeaturedProducts(
  params?: FeaturedProductParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/products/featured', params);
  return await api.get<Product[]>(url, options);
}

export async function getBestsellers(
  params?: BestsellerProductParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/products/bestsellers', params);
  return await api.get<Product[]>(url, options);
}

export async function getNewArrivals(
  params?: NewArrivalProductParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/products/new-arrivals', params);
  return await api.get<Product[]>(url, options);
}

export async function getDiscountedProducts(
  params?: DiscountedProductParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/products/discounted', params);
  return await api.get<Product[]>(url, options);
}

// Search
export async function searchProducts(
  params: SearchParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/search', params);
  return await api.get<SearchResponse>(url, options);
}

// Categories
export async function getCategories(options?: RequestInit) {
  const url = buildUrlWithParams('api/categories');
  return await api.get<Category[]>(url, options);
}

// Brands
export async function getBrands(
  params?: BrandListParams,
  options?: RequestInit,
) {
  const url = buildUrlWithParams('api/brands', params);
  return await api.get<Brand[]>(url, options);
}
