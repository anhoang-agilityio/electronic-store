import { FetchHttpClient } from '@effect/platform';
import { Layer, ManagedRuntime } from 'effect';

import { ApiClient } from '@/lib/api-client';

const appLayer = ApiClient.layer.pipe(Layer.provide(FetchHttpClient.layer));

export const appRuntime = ManagedRuntime.make(appLayer);
