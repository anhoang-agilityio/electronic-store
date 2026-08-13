import { Effect } from 'effect';
import type { MetadataRoute } from 'next';

import { loadPublicConfig } from '@/config/public-config';
import { getCategories } from '@/features/category/api/get-categories';
import { getProducts } from '@/features/product/api/get-products';
import { Category } from '@/types/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = Effect.runSync(loadPublicConfig()).baseUrl;

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: new URL('/', baseUrl).toString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: new URL('/about', baseUrl).toString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: new URL('/contact', baseUrl).toString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: new URL('/blog', baseUrl).toString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Fetch all categories
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  // Generate category URLs
  const categoryUrls: MetadataRoute.Sitemap = categories.map((category) => ({
    url: new URL(`/${category.id}`, baseUrl).toString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Generate product URLs for each category (fetch all pages)
  const productUrls: MetadataRoute.Sitemap = [];
  const PAGE_SIZE = 100;
  for (const category of categories) {
    let page = 1;
    let total = 0;
    do {
      try {
        const response = await getProducts({
          category: category.id,
          page,
          pageSize: PAGE_SIZE,
        });
        if (response && Array.isArray(response.products)) {
          productUrls.push(
            ...response.products.map((product) => ({
              url: new URL(`/${category.id}/${product.id}`, baseUrl).toString(),
              changeFrequency: 'weekly' as const,
              priority: 0.5,
            })),
          );
          total = response.total;
          page++;
          // Stop if we've fetched all products
          if (response.products.length < PAGE_SIZE) break;
        }
      } catch {
        // Fetch error, continue to next page
        continue;
      }
    } while ((page - 1) * PAGE_SIZE < total);
  }

  // Combine all URLs for the sitemap
  return [...staticPages, ...categoryUrls, ...productUrls];
}
