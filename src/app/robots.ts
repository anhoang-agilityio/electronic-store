import { Effect } from 'effect';
import type { MetadataRoute } from 'next';

import { loadPublicConfig } from '@/config/public-config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = Effect.runSync(loadPublicConfig()).baseUrl;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout/', '/cart/', '/profile/'],
    },
    sitemap: new URL('/sitemap.xml', baseUrl).toString(),
  };
}
