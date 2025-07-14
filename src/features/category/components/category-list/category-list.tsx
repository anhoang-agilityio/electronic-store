import { Suspense } from 'react';

import { getCategories } from '@/api/api-client';

import { CategoryListSkeleton } from './category-list-skeleton';
import { CategoryListUI } from './category-list-ui';

// Component to fetch and display categories
async function CategoryListWithData() {
  const categories = await getCategories();

  // Transform API data to match CategoryCard type
  const transformedCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    image: category.image,
  }));

  return <CategoryListUI categories={transformedCategories} />;
}

// Main container component with Suspense
export function CategoryList() {
  return (
    <Suspense fallback={<CategoryListSkeleton />}>
      <CategoryListWithData />
    </Suspense>
  );
}
