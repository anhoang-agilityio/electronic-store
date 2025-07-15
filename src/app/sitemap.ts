import type { MetadataRoute } from 'next';

import { getCategories, getProducts } from '@/api/api-client';
import { env } from '@/config/env';
import { Category } from '@/types/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.BASE_URL;

  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.5 },
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
    url: `${baseUrl}/${category.id}`,
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
              url: `${baseUrl}/${category.id}/${product.id}`,
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
        continue;
      }
    } while ((page - 1) * PAGE_SIZE < total);
  }

  // Combine all URLs for the sitemap
  return [...staticPages, ...categoryUrls, ...productUrls];
}
