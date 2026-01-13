'use client';

import { useCategories } from '@/app/(protected)/categories/_hooks/useCategories';
import QueryBoundary from '@/components/data/QueryBoundary';
import CategoryIndexView from '../display/view/CategoryIndexView';

export default function CategoriesClient() {
  const query = useCategories();

  return (
    <QueryBoundary {...query} loadingMessage="カテゴリを読み込んでいます...">
      {(categories) => <CategoryIndexView categories={categories} />}
    </QueryBoundary>
  );
}
