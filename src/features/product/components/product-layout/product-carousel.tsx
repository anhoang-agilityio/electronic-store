'use client';

import React from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  ProductCard,
  ProductCardProps,
} from '@/features/product/components/product-card';
import { chunkArray } from '@/utils/array';

type ValidColumns = 1 | 2 | 3 | 4 | 5 | 6;

export type ProductCarouselProps = Omit<ProductCardProps, 'product'> & {
  products: ProductCardProps['product'][];
  columns?: ValidColumns;
  rows?: number;
};

export function ProductCarousel({
  products,
  columns = 4,
  rows = 2,
}: ProductCarouselProps) {
  const slides = chunkArray(products, rows);
  const totalItems = columns * rows;
  const showNavigation = products.length > totalItems;

  // Define basis classes that Tailwind will scan
  const basisMap: Record<number, string> = {
    1: 'basis-full',
    2: 'basis-1/2',
    3: 'basis-1/3',
    4: 'basis-1/4',
    5: 'basis-1/5',
    6: 'basis-1/6',
  };

  const basisClass = basisMap[columns];

  return (
    <Carousel
      aria-label="Product discount"
      opts={{
        align: 'start',
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {slides.map((group, idx) => (
          <CarouselItem
            key={idx}
            className={`pl-4 ${basisClass} flex flex-col gap-4`}
          >
            {group.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </CarouselItem>
        ))}
      </CarouselContent>
      {showNavigation && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
}
