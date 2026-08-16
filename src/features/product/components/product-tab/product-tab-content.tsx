import { Effect } from 'effect';
import React, { Suspense } from 'react';

import { toProductCard } from '@/features/product/mappers/product-mapper';
import { ProductService } from '@/features/product/service/product-service';
import { appRuntime } from '@/lib/effect/runtime';

import {
  ProductGrid,
  ProductListSkeleton,
  type ProductGridProps,
} from '../product-layout';

import { TabValue } from './config';

type ProductTabContentProps = {
  tabType: TabValue;
};

type ProductGridWithDataProps = ProductTabContentProps &
  Pick<ProductGridProps, 'columns' | 'rows'>;

// Error fallback UI
function ProductGridError() {
  return (
    <div className="p-4 text-center text-destructive">
      Failed to load products. Please try again later.
    </div>
  );
}

// Server component that fetches data based on tabType
async function ProductGridWithData({
  tabType,
  columns,
  rows,
}: ProductGridWithDataProps): Promise<React.ReactNode> {
  return appRuntime.runPromise(
    Effect.gen(function* () {
      const productService = yield* ProductService.Service;

      const products = yield* (() => {
        switch (tabType) {
          case TabValue.NEW_ARRIVAL:
            return productService.getNewArrivals({ limit: 8 });
          case TabValue.BESTSELLER:
            return productService.getBestsellers({ limit: 8 });
          case TabValue.FEATURED:
            return productService.getFeaturedProducts({ limit: 8 });
        }
      })();

      const cardModels = products.map(toProductCard);

      return (
        <ProductGrid
          key={tabType}
          products={cardModels}
          columns={columns}
          rows={rows}
        />
      );
    }).pipe(Effect.catchAll(() => Effect.succeed(<ProductGridError />))),
  );
}

export function ProductTabContent({ tabType }: ProductTabContentProps) {
  return (
    <>
      <div className="hidden md:block">
        <Suspense fallback={<ProductListSkeleton columns={4} rows={2} />}>
          <ProductGridWithData tabType={tabType} columns={4} rows={2} />
        </Suspense>
      </div>
      <div className="block md:hidden">
        <Suspense fallback={<ProductListSkeleton columns={2} rows={4} />}>
          <ProductGridWithData tabType={tabType} columns={2} rows={4} />
        </Suspense>
      </div>
    </>
  );
}
