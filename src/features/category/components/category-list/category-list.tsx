import { Effect } from 'effect';
import { Suspense } from 'react';

import { CategoryService } from '@/features/category/service/category-service';
import { appRuntime } from '@/lib/effect/runtime';

import { CategoryListSkeleton } from './category-list-skeleton';
import { CategoryListUI } from './category-list-ui';

async function CategoryListWithData() {
  return appRuntime.runPromise(
    Effect.gen(function* () {
      const categoryService = yield* CategoryService.Service;
      const categories = yield* categoryService.getCategories();

      return <CategoryListUI key="category-list" categories={categories} />;
    }).pipe(Effect.catchAll(() => Effect.succeed(null))),
  );
}
export function CategoryList() {
  return (
    <Suspense fallback={<CategoryListSkeleton />}>
      <CategoryListWithData />
    </Suspense>
  );
}
