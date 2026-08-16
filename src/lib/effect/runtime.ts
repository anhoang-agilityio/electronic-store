import { Layer, ManagedRuntime } from 'effect';

import { PublicConfig } from '@/config/public-config';
import { BrandService } from '@/features/brand/service/brand-service';
import { CategoryService } from '@/features/category/service/category-service';
import { ApiClient } from '@/lib/api-client';

const appLayer = Layer.mergeAll(
  PublicConfig.defaultLayer,
  ApiClient.defaultLayer,
  CategoryService.defaultLayer,
  BrandService.defaultLayer,
);

export const appRuntime = ManagedRuntime.make(appLayer);
