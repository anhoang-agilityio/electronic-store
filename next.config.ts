import type { NextConfig } from 'next';
import type { RemotePattern } from 'next/dist/shared/lib/image-config';

import { env } from '@/config/env';

const apiUrl = env.API_URL;
let remotePatterns: RemotePattern[] = [];

if (apiUrl) {
  try {
    const url = new URL(apiUrl);
    let protocol: 'http' | 'https' | undefined;
    const proto = url.protocol.replace(':', '');

    if (proto === 'https') {
      protocol = 'https';
    } else if (proto === 'http') {
      protocol = 'http';
    } else {
      protocol = undefined;
    }

    remotePatterns = [
      {
        protocol,
        hostname: url.hostname,
        pathname: '/images/**',
      },
    ];
  } catch {
    // If parsing fails, keep remotePatterns as an empty array
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
