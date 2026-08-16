import { Console, Effect } from 'effect';
import type { NextConfig } from 'next';
import type { RemotePattern } from 'next/dist/shared/lib/image-config';

import { PublicConfig } from '@/config/public-config';
import { appRuntime } from '@/lib/effect/runtime';

const buildRemotePattern = Effect.gen(function* () {
  const config = yield* PublicConfig.Service;
  const { apiUrl } = yield* config.get;

  const protocol: RemotePattern['protocol'] =
    apiUrl.protocol === 'https:' ? 'https' : 'http';

  return [
    {
      protocol,
      hostname: apiUrl.hostname,
      pathname: '/images/**',
    },
  ] as RemotePattern[];
}).pipe(
  Effect.tapError((cause) =>
    Console.error('[next.config] Failed to build remote pattern:', cause),
  ),
);

const buildNextConfig = Effect.gen(function* () {
  const remotePatterns = yield* buildRemotePattern;

  return {
    images: {
      remotePatterns,
    },
  } satisfies NextConfig;
});

const nextConfig = appRuntime.runSync(buildNextConfig);

export default nextConfig;
