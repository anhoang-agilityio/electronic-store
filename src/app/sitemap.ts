import { Effect } from 'effect';
import type { MetadataRoute } from 'next';

import { PublicConfig } from '@/config/public-config';
import { CategoryService } from '@/features/category/service/category-service';
import { ProductService } from '@/features/product/service/product-service';
import { appRuntime } from '@/lib/effect/runtime';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { baseUrl } = PublicConfig.Service.pipe(
    Effect.flatMap((service) => service.get),
    appRuntime.runSync,
  );

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
  const categories = await CategoryService.Service.pipe(
    Effect.flatMap((service) => service.getCategories()),
    Effect.catchAll(() => Effect.succeed([])),
    appRuntime.runPromise,
  );

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
        const response = await ProductService.Service.pipe(
          Effect.flatMap((service) =>
            service.getProducts({
              category: category.id,
              page,
              pageSize: PAGE_SIZE,
            }),
          ),
          appRuntime.runPromise,
        );

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
        } else {
          break;
        }
      } catch {
        // Fetch error, stop pagination for this category
        break;
      }
    } while ((page - 1) * PAGE_SIZE < total);
  }

  // Combine all URLs for the sitemap
  return [...staticPages, ...categoryUrls, ...productUrls];
}
