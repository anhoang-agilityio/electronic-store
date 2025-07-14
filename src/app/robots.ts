import type { MetadataRoute } from 'next';

import { env } from '@/config/env';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.BASE_URL;
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout/', '/cart/', '/profile/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
