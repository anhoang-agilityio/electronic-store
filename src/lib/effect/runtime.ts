import { Layer, ManagedRuntime } from 'effect';

import { PublicConfig } from '@/config/public-config';
import { CategoryService } from '@/features/category/service/category-service';

const appLayer = Layer.merge(
  PublicConfig.defaultLayer,
  CategoryService.defaultLayer,
);

export const appRuntime = ManagedRuntime.make(appLayer);
