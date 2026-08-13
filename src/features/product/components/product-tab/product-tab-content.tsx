import { Effect } from 'effect';
import React, { Suspense } from 'react';

import { getBestsellers } from '@/features/product/api/get-bestsellers';
import { getFeaturedProducts } from '@/features/product/api/get-featured-products';
import { getNewArrivals } from '@/features/product/api/get-new-arrivals';

import { adaptApiProductToProductCard } from '../../utils/dto';
import {
  ProductGrid,
  ProductListSkeleton,
  type ProductGridProps,
} from '../product-layout';

import { TabValue } from './config';

type ProductTabContentProps = {
  tabType: TabValue;
};

// API mapping function
const getProductsByTabType = (tabType: TabValue) => {
  const apiMapping = {
    [TabValue.NEW_ARRIVAL]: () => getNewArrivals({ limit: 8 }),
    [TabValue.BESTSELLER]: () => getBestsellers({ limit: 8 }),
    [TabValue.FEATURED]: () => getFeaturedProducts({ limit: 8 }),
  };

  return apiMapping[tabType]();
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
}: ProductGridWithDataProps) {
  return Effect.runPromise(
    getProductsByTabType(tabType).pipe(
      Effect.map((apiProducts) => {
        const products = apiProducts.map(adaptApiProductToProductCard);
        return (
          <ProductGrid
            key={tabType}
            products={products}
            columns={columns}
            rows={rows}
          />
        );
      }),
      Effect.catchAll(() => Effect.succeed(<ProductGridError />)),
    ),
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
