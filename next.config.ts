import { Effect } from 'effect';
import type { NextConfig } from 'next';
import type { RemotePattern } from 'next/dist/shared/lib/image-config';

import { loadPublicConfig } from '@/config/public-config';

const apiUrl = Effect.runSync(loadPublicConfig()).apiUrl;
const protocol: RemotePattern['protocol'] =
  apiUrl.protocol === 'https:' ? 'https' : 'http';

const remotePatterns: RemotePattern[] = [
  {
    protocol,
    hostname: apiUrl.hostname,
    pathname: '/images/**',
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
