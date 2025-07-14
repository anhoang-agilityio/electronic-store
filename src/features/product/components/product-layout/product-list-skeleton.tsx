'use client';

import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

type ValidColumns = 1 | 2 | 3 | 4 | 5 | 6;

export type ProductListSkeletonProps = {
  columns?: ValidColumns;
  rows?: number;
};

export function ProductListSkeleton({
  columns = 4,
  rows = 2,
}: ProductListSkeletonProps) {
  const totalItems = columns * rows;

  // Define grid column classes that Tailwind will scan
  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const gridCols = gridColsMap[columns];
  const gap = 'gap-4';

  return (
    <div className={`grid ${gridCols} ${gap}`}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <div
          key={index}
          className="size-full bg-card text-card-foreground rounded-md pt-13 pb-4 px-6 shadow-sm relative"
        >
          {/* Top Section with Like Button Skeleton */}
          <div className="absolute top-2 right-2">
            <Skeleton className="size-10 rounded-full" />
          </div>

          <div className="flex flex-col gap-1 items-center">
            {/* Product Image Skeleton */}
            <div className="w-3/5 max-w-40 aspect-square relative">
              <Skeleton className="w-full h-full rounded-md" />
            </div>

            {/* Product Info and Button Skeleton */}
            <div className="space-y-4 text-center w-full">
              {/* Product Name Skeleton */}
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />

              {/* Price Skeleton */}
              <Skeleton className="h-6 w-20 mx-auto" />

              {/* Button Skeleton */}
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
