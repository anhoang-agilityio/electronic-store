import { Layer, ManagedRuntime } from 'effect';

import { PublicConfig } from '@/config/public-config';
import { ApiClient } from '@/lib/api-client';

const appLayer = Layer.merge(ApiClient.defaultLayer, PublicConfig.defaultLayer);

export const appRuntime = ManagedRuntime.make(appLayer);
