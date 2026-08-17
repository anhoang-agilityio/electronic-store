import type { NextConfig } from 'next';
import type { RemotePattern } from 'next/dist/shared/lib/image-config';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
let remotePatterns: RemotePattern[] = [];

if (apiUrl) {
  try {
    const url = new URL(apiUrl);
    const proto = url.protocol.replace(':', '');
    let protocol: RemotePattern['protocol'];

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
