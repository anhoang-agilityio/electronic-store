import { Suspense } from 'react';

import { getRelatedProducts } from '@/features/product/api/get-related-products';
import { adaptApiProductToProductCard } from '@/features/product/utils/dto';

import {
  ProductListSkeleton,
  type ProductCarouselProps,
  ProductCarousel,
} from './product-layout';

type ProductCarouselWithDataProps = Pick<
  ProductCarouselProps,
  'columns' | 'rows'
> & { productId: string };

async function ProductCarouselWithData({
  columns,
  rows,
  productId,
}: ProductCarouselWithDataProps) {
  const apiProducts = await getRelatedProducts(productId);
  const products = apiProducts.map(adaptApiProductToProductCard);
  const actualColumns = Math.min(
    products.length,
    columns ?? 4,
  ) as ProductCarouselProps['columns'];

  return (
    <ProductCarousel products={products} columns={actualColumns} rows={rows} />
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
