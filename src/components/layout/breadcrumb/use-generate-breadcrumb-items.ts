'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { paths } from '@/config/paths';
import { getCategory } from '@/features/category/api/get-category';
import { getProduct } from '@/features/product/api/get-product';

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
            const category = await getCategory(categoryId);

            if (category) {
              items.push({
                label: category.name,
                isCurrent: true,
              });
            } else {
              setBreadcrumbItems([]);
              setIsLoading(false);
              return;
            }
          }
        }
        // Handle product route (2 segments: category/product)
        else if (segments.length === 2) {
          const [categoryId, productId] = segments;

          if (categoryId && productId) {
            const category = await getCategory(categoryId);

            if (!category) {
              setBreadcrumbItems([]);
              setIsLoading(false);
              return;
            }

            items.push({
              label: category.name,
              href: `/${categoryId}`,
            });

            const product = await getProduct(productId);
            if (product?.name) {
              items.push({
                label: product.name,
                isCurrent: true,
              });
            } else {
              setBreadcrumbItems([]);
              setIsLoading(false);
              return;
            }
          }
        }

        setBreadcrumbItems(items);
      } catch {
        // If any error occurs, do not show breadcrumb
        setBreadcrumbItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    void generateBreadcrumbItems();
  }, [pathname]);

  return { breadcrumbItems, isLoading };
}
