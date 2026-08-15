import { Context, Effect, Layer } from 'effect';

import type { Category } from '../domain';
import { CategoryRepository } from '../repository/category-repository';

type GetCategoriesError = CategoryRepository.FindAllError;
type GetCategoryError = CategoryRepository.FindByIdError;

type Interface = {
  getCategories: () => Effect.Effect<Category[], GetCategoriesError>;
  getCategory: (id: string) => Effect.Effect<Category, GetCategoryError>;
};

export class Service extends Context.Tag('CategoryService')<
  Service,
  Interface
>() {}

export const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const categoryRepository = yield* CategoryRepository.Service;

    return Service.of({
      getCategories: Effect.fn('CategoryService.getCategories')(() =>
        categoryRepository.findAll(),
      ),
      getCategory: Effect.fn('CategoryService.getCategory')((id) =>
        categoryRepository.findById(id),
      ),
    });
  }),
);

export const defaultLayer = layer.pipe(
  Layer.provide(CategoryRepository.defaultLayer),
);

export * as CategoryService from './category-service';
