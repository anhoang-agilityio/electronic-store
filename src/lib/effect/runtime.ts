import { Layer, ManagedRuntime } from 'effect';

import { PublicConfig } from '@/config/public-config';
import { BrandService } from '@/features/brand/service/brand-service';
import { CategoryService } from '@/features/category/service/category-service';
import { ProductService } from '@/features/product/service/product-service';
import { ApiClient } from '@/lib/api-client';

const appLayer = Layer.mergeAll(
  PublicConfig.defaultLayer,
  ApiClient.defaultLayer,
  CategoryService.defaultLayer,
  BrandService.defaultLayer,
  ProductService.defaultLayer,
);

export const appRuntime = ManagedRuntime.make(appLayer);
