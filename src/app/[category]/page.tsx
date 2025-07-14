import type { Metadata } from 'next';
import React from 'react';

import { getBrands, getProducts, getCategories } from '@/api/api-client';
import { ProductFilter } from '@/features/product/components/product-filter';
import { ProductGrid } from '@/features/product/components/product-layout/product-grid';
import { ProductSort } from '@/features/product/components/product-sort';
import { adaptApiProductToProductCard } from '@/features/product/utils/dto';
import { Sort } from '@/types/api';

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const categories = await getCategories();
  const categoryObj = categories.find((c) => c.id === params.category);
  const categoryName = categoryObj?.name ?? 'Category';

  return {
    title: categoryName,
    description: `Browse and filter the best ${categoryName} products at Electronic Store. Find the latest and most suitable electronics for your needs.`,
  };
}

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    brands?: string;
    sort?: Sort;
  }>;
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = (await params).category;
  const page = parseInt((await searchParams).page ?? '1', 10);
  const minPrice = parseInt((await searchParams).minPrice ?? '0', 10);
  const maxPrice = parseInt((await searchParams).maxPrice ?? '12999', 10);
  const filterBrands = (await searchParams).brands;
  const sort = (await searchParams).sort;
  const pageSize = 12;

  // Fetch brands for filter
  const brandsRaw = await getBrands({ category });

  // Map API brands to filter brands
  const brands = brandsRaw.map((b) => ({
    brandId: b.id,
    brandName: b.name,
  }));

  // Fetch products for this category
  const data = await getProducts({
    category,
    page,
    pageSize,
    minPrice,
    maxPrice,
    brands: filterBrands,
    sort,
  });

  const productCardInputs = data.products.map(adaptApiProductToProductCard);

  return (
    <div className="relative px-10 pt-11 md:pt-6 pb-14 grid grid-cols-2 md:grid-cols-[25%_1fr_min-content] md:gap-x-8 gap-y-10 md:gap-y-6">
      {/* Filter sidebar */}
      <div className="col-start-1 md:row-span-2">
        <ProductFilter brands={brands} />
      </div>
      {/* Sort */}
      <div className="justify-self-end col-start-2 md:col-start-3 md:row-start-1">
        <ProductSort />
      </div>
      {/* Result count */}
      <div className="col-span-2 md:col-span-1 md:col-start-2 md:row-start-1">
        <span className="text-base">Products Result: </span>
        <span className="text-xl font-medium">{data.total}</span>
      </div>
      {/* Product grid */}
      <div className="md:col-start-2 col-span-2 md:row-start-2">
        <div className="hidden md:block">
          <ProductGrid
            products={productCardInputs}
            columns={3}
            rows={4}
            currentPage={data.page}
            totalProducts={data.total}
            itemsPerPage={data.pageSize}
          />
        </div>
        <div className="block md:hidden">
          <ProductGrid
            products={productCardInputs}
            columns={2}
            rows={6}
            currentPage={data.page}
            totalProducts={data.total}
            itemsPerPage={data.pageSize}
          />
        </div>
      </div>
    </div>
  );
}
