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
> & { productId: string };

function ProductCarouselError() {
  return (
    <div className="p-4 text-center text-destructive">
      Failed to load related products. Please try again later.
    </div>
  );
}

async function ProductCarouselWithData({
  columns,
  rows,
  productId,
}: ProductCarouselWithDataProps): Promise<React.ReactNode> {
  return appRuntime.runPromise(
    Effect.gen(function* () {
      const productService = yield* ProductService.Service;
      const products = yield* productService.getRelatedProducts(productId);
      const cardModels = products.map(toProductCard);
      const actualColumns = Math.min(
        cardModels.length,
        columns ?? 4,
      ) as ProductCarouselProps['columns'];

      return (
        <ProductCarousel
          products={cardModels}
          columns={actualColumns}
          rows={rows}
        />
      );
    }).pipe(Effect.catchAll(() => Effect.succeed(<ProductCarouselError />))),
  );
}

export function ProductRelated({ productId }: { productId: string }) {
  return (
    <section className="w-full space-y-8">
      <h2 className="text-2xl font-medium">Related Products</h2>
      <div className="hidden md:block">
        <Suspense fallback={<ProductListSkeleton columns={4} rows={1} />}>
          <ProductCarouselWithData columns={4} rows={1} productId={productId} />
        </Suspense>
      </div>
      <div className="block md:hidden">
        <Suspense fallback={<ProductListSkeleton columns={2} rows={2} />}>
          <ProductCarouselWithData columns={2} rows={2} productId={productId} />
        </Suspense>
      </div>
    </section>
  );
}
