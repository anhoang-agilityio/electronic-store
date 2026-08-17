import { Effect } from 'effect';
import type { MetadataRoute } from 'next';

import { PublicConfig } from '@/config/public-config';
import { appRuntime } from '@/lib/effect/runtime';

export default function robots(): MetadataRoute.Robots {
  const { baseUrl } = PublicConfig.Service.pipe(
    Effect.flatMap((service) => service.get),
    appRuntime.runSync,
  );

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout/', '/cart/', '/profile/'],
    },
    sitemap: new URL('/sitemap.xml', baseUrl).toString(),
  };
}
