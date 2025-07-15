import React, { Suspense } from 'react';

import {
  getBestsellers,
  getNewArrivals,
  getFeaturedProducts,
} from '@/api/api-client';
import type { Product as ApiProduct } from '@/types/api';

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
const getProductsByTabType = async (
  tabType: TabValue,
): Promise<ApiProduct[]> => {
  const apiMapping = {
    [TabValue.NEW_ARRIVAL]: () => getNewArrivals({ limit: 8 }),
    [TabValue.BESTSELLER]: () => getBestsellers({ limit: 8 }),
    [TabValue.FEATURED]: () => getFeaturedProducts({ limit: 8 }),
  };

  const apiCall = apiMapping[tabType];
  return apiCall ? await apiCall() : [];
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
  try {
    // Fetch data based on tabType
    const apiProducts = await getProductsByTabType(tabType);

    // Convert API products to ProductList format
    const products = apiProducts.map(adaptApiProductToProductCard);

    return <ProductGrid products={products} columns={columns} rows={rows} />;
  } catch {
    return <ProductGridError />;
  }
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
