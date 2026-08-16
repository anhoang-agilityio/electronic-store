import { Effect } from 'effect';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BrandService } from '@/features/brand/service/brand-service';
import { CategoryService } from '@/features/category/service/category-service';
import { ProductFilter } from '@/features/product/components/product-filter';
import { ProductGrid } from '@/features/product/components/product-layout';
import { ProductSort } from '@/features/product/components/product-sort';
import { toProductCard } from '@/features/product/mappers/product-mapper';
import { ProductService } from '@/features/product/service/product-service';
import { appRuntime } from '@/lib/effect/runtime';
import type { Sort } from '@/types/api';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fetchCategoryOrNotFound(categoryId: string) {
  return Effect.gen(function* () {
    const categoryService = yield* CategoryService.Service;
    return yield* categoryService.getCategory(categoryId);
  }).pipe(
    Effect.catchTag('CategoryNotFoundError', () =>
      Effect.sync(() => notFound()),
    ),
  );
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = parseInt(value ?? '', 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
}

function parsePrice(value: string | undefined, fallback: number): number {
  const parsed = parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): Promise<Metadata> {
  const { categoryId } = await params;
  const category = await appRuntime.runPromise(
    fetchCategoryOrNotFound(categoryId),
  );

  return {
    title: category.name,
    description: `Browse and filter the best ${category.name} products at Electronic Store. Find the latest and most suitable electronics for your needs.`,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

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
  const [{ category }, query] = await Promise.all([params, searchParams]);

  // Validate category exists — triggers notFound() on 404 via Effect.
  await appRuntime.runPromise(fetchCategoryOrNotFound(category));

  const page = parsePositiveInt(query.page, 1);
  const minPrice = parsePrice(query.minPrice, 0);
  const maxPrice = parsePrice(query.maxPrice, 12999);
  const pageSize = 12;

  const { brands, data } = await appRuntime.runPromise(
    Effect.gen(function* () {
      const brandService = yield* BrandService.Service;
      const productService = yield* ProductService.Service;

      return yield* Effect.all(
        {
          brands: brandService.getBrands({ category }),
          data: productService.getProducts({
            category,
            page,
            pageSize,
            minPrice,
            maxPrice,
            brands: query.brands,
            sort: query.sort,
          }),
        },
        { concurrency: 'unbounded' },
      );
    }),
  );

  const products = data.products.map(toProductCard);

  return (
    <main className="relative px-10 pt-11 md:pt-6 pb-14 grid grid-cols-2 md:grid-cols-[25%_1fr_min-content] md:gap-x-8 gap-y-10 md:gap-y-6">
      <h1 className="sr-only">Product list by category</h1>
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
            products={products}
            columns={3}
            rows={4}
            currentPage={data.page}
            totalProducts={data.total}
            itemsPerPage={data.pageSize}
          />
        </div>
        <div className="block md:hidden">
          <ProductGrid
            products={products}
            columns={2}
            rows={6}
            currentPage={data.page}
            totalProducts={data.total}
            itemsPerPage={data.pageSize}
          />
        </div>
      </div>
    </main>
  );
}
