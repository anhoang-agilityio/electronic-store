import { Effect } from 'effect';
import React, { Suspense } from 'react';

import { toProductCard } from '@/features/product/mappers/product-mapper';
import { ProductService } from '@/features/product/service/product-service';
import { appRuntime } from '@/lib/effect/runtime';

import {
  ProductCarousel,
  ProductListSkeleton,
  type ProductCarouselProps,
} from './product-layout';

type ProductCarouselWithDataProps = Pick<
  ProductCarouselProps,
  'columns' | 'rows'
>;

// Error fallback UI
function ProductCarouselError() {
  return (
    <div className="p-4 text-center text-destructive">
      Failed to load discounted products. Please try again later.
    </div>
  );
}

async function ProductCarouselWithData({
  columns,
  rows,
}: ProductCarouselWithDataProps): Promise<React.ReactNode> {
  return appRuntime.runPromise(
    Effect.gen(function* () {
      const productService = yield* ProductService.Service;
      const products = yield* productService.getDiscountedProducts({
        limit: 8,
      });
      const cardModels = products.map(toProductCard);

      return (
        <ProductCarousel
          key="discounted-products"
          products={cardModels}
          columns={columns}
          rows={rows}
        />
      );
    }).pipe(Effect.catchAll(() => Effect.succeed(<ProductCarouselError />))),
  );
}

export function ProductDiscount() {
  return (
    <section className="max-w-screen-xl mx-auto px-10 space-y-8">
      <h2 className="text-2xl font-medium">Discount up to -50%</h2>
      <div className="hidden md:block">
        <Suspense fallback={<ProductListSkeleton columns={4} rows={1} />}>
          <ProductCarouselWithData columns={4} rows={1} />
        </Suspense>
      </div>
      <div className="block md:hidden">
        <Suspense fallback={<ProductListSkeleton columns={2} rows={2} />}>
          <ProductCarouselWithData columns={2} rows={2} />
        </Suspense>
      </div>
    </section>
  );
}
