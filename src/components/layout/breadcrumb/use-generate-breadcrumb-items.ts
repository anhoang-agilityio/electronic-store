'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getCategories, getProduct } from '@/api/api-client';
import { paths } from '@/config/paths';

type BreadcrumbItem = {
  label: string;
  href?: string;
  isCurrent?: boolean;
};

export function useGenerateBreadcrumbItems() {
  const pathname = usePathname();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function generateBreadcrumbItems() {
      setIsLoading(true);

      try {
        const segments = pathname.split('/').filter(Boolean);

        if (segments.length === 0) {
          setBreadcrumbItems([]);
          setIsLoading(false);
          return;
        }

        const items: BreadcrumbItem[] = [
          {
            label: 'Home',
            href: paths.home.getHref(),
          },
        ];

        // Handle category route (1 segment)
        if (segments.length === 1) {
          const categoryId = segments[0];

          if (categoryId) {
            // Fetch category data
            const categories = await getCategories();
            const category = categories.find((cat) => cat.id === categoryId);

            if (category) {
              items.push({
                label: category.name,
                isCurrent: true,
              });
            } else {
              // Fallback if category not found
              items.push({
                label: categoryId,
                isCurrent: true,
              });
            }
          }
        }

        // Handle product route (2 segments: category/product)
        else if (segments.length === 2) {
          const [categoryId, productId] = segments;

          if (categoryId && productId) {
            // Fetch category data
            const categories = await getCategories();
            const category = categories.find((cat) => cat.id === categoryId);

            if (category) {
              items.push({
                label: category.name,
                href: `/${categoryId}`,
              });
            } else {
              // Fallback if category not found
              items.push({
                label: categoryId,
                href: `/${categoryId}`,
              });
            }

            // Fetch product data
            try {
              const product = await getProduct(productId);
              items.push({
                label: product.name,
                isCurrent: true,
              });
            } catch {
              // Fallback if product not found
              items.push({
                label: productId,
                isCurrent: true,
              });
            }
          }
        }

        setBreadcrumbItems(items);
      } catch {
        // Fallback to basic breadcrumb
        const segments = pathname.split('/').filter(Boolean);
        const fallbackItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

        segments.forEach((segment, index) => {
          const isLast = index === segments.length - 1;
          fallbackItems.push({
            label: segment,
            href: isLast
              ? undefined
              : `/${segments.slice(0, index + 1).join('/')}`,
            isCurrent: isLast,
          });
        });

        setBreadcrumbItems(fallbackItems);
      } finally {
        setIsLoading(false);
      }
    }

    void generateBreadcrumbItems();
  }, [pathname]);

  return { breadcrumbItems, isLoading };
}
