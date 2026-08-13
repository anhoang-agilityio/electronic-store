import { Effect } from 'effect';
import { Suspense } from 'react';

import { getCategories } from '@/features/category/api/get-categories';

import { CategoryListSkeleton } from './category-list-skeleton';
import { CategoryListUI } from './category-list-ui';

// Component to fetch and display categories
async function CategoryListWithData() {
  return Effect.runPromise(
    getCategories().pipe(
      Effect.map((categories) => {
        const transformedCategories = categories.map((category) => ({
          id: category.id,
          name: category.name,
          image: category.image,
        }));

        return (
          <CategoryListUI
            key="category-list"
            categories={transformedCategories}
          />
        );
      }),
      Effect.catchAll(() => Effect.succeed(null)),
    ),
  );
}

// Main container component with Suspense
export function CategoryList() {
  return (
    <Suspense fallback={<CategoryListSkeleton />}>
      <CategoryListWithData />
    </Suspense>
  );
}
