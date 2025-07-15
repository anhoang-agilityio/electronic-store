import { Suspense } from 'react';

import { getDiscountedProducts } from '@/api/api-client';

import { adaptApiProductToProductCard } from '../utils/dto';

import {
  ProductListSkeleton,
  type ProductCarouselProps,
  ProductCarousel,
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
}: ProductCarouselWithDataProps) {
  try {
    const apiProducts = await getDiscountedProducts({ limit: 8 });

    const products = apiProducts.map(adaptApiProductToProductCard);

    return (
      <ProductCarousel products={products} columns={columns} rows={rows} />
    );
  } catch {
    return <ProductCarouselError />;
  }
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
