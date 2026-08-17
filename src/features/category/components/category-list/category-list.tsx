import { Effect } from 'effect';
import { Suspense } from 'react';

import { Category } from '@/features/category/domain';
import { CategoryService } from '@/features/category/service/category-service';
import { appRuntime } from '@/lib/effect/runtime';

import { CategoryListSkeleton } from './category-list-skeleton';
import { CategoryListUI } from './category-list-ui';

async function CategoryListWithData() {
  return CategoryService.Service.pipe(
    Effect.flatMap((service) => service.getCategories()),
    Effect.map((categories) => categories.map((c) => Category.toPlain(c))),
    Effect.andThen((categories) =>
      Effect.succeed(
        <CategoryListUI key="category-list" categories={categories} />,
      ),
    ),
    Effect.catchAll(() => Effect.succeed(null)),
    appRuntime.runPromise,
  );
}

export function CategoryList() {
  return (
    <Suspense fallback={<CategoryListSkeleton />}>
      <CategoryListWithData />
    </Suspense>
  );
}
