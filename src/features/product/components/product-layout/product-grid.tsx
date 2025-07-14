'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  ProductCard,
  type ProductCardProps,
} from '@/features/product/components/product-card';

type ValidColumns = 1 | 2 | 3 | 4 | 5 | 6;

export type ProductGridProps = Omit<ProductCardProps, 'product'> & {
  products: ProductCardProps['product'][];
  columns?: ValidColumns;
  rows?: number;
  currentPage?: number;
  totalProducts?: number;
  itemsPerPage?: number;
};

export function ProductGrid({
  products,
  columns = 4,
  rows = 2,
  currentPage = 1,
  totalProducts = 0,
  itemsPerPage,
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  // Calculate items per page if not provided
  const calculatedItemsPerPage = itemsPerPage ?? columns * rows;

  // Calculate total pages based on total products
  const totalPages = Math.ceil(totalProducts / calculatedItemsPerPage);

  // Show pagination if there are multiple pages
  const showPagination = totalPages > 1;

  // Navigation methods
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(totalPages);
  };

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

  const renderPagination = () => {
    if (!showPagination) return null;

    const pageNumbers = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={goToPreviousPage}
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={goToFirstPage}
                  className="cursor-pointer"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => goToPage(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  onClick={goToLastPage}
                  className="cursor-pointer"
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={goToNextPage}
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <>
      <div className={`grid ${gridCols} ${gap}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {renderPagination()}
    </>
  );
}
