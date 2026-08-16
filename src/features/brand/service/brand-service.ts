import { Context, Effect, Layer } from 'effect';

import type { Brand } from '../domain';
import { BrandRepository } from '../repository/brand-repository';

type GetBrandsParam = BrandRepository.FindAllParam;
type GetBrandsError = BrandRepository.FindAllError;

type Interface = {
  getBrands: (
    params?: GetBrandsParam,
  ) => Effect.Effect<Brand[], GetBrandsError>;
};

export class Service extends Context.Tag('BrandService')<
  Service,
  Interface
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const brandRepository = yield* BrandRepository.Service;

    return Service.of({
      getBrands: Effect.fn('BrandService.getBrands')((params) =>
        brandRepository.findAll(params),
      ),
    });
  }),
);

export const defaultLayer = layer.pipe(
  Layer.provide(BrandRepository.defaultLayer),
);

export * as BrandService from './brand-service';
