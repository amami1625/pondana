'use client';

import { useCategories } from '@/app/(protected)/categories/_hooks/useCategories';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import LoadingState from '@/components/feedback/LoadingState';
import CategoryIndexView from '../display/view/CategoryIndexView';

export default function CategoriesClient() {
  const { data: categories, isLoading, error } = useCategories();

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="カテゴリを読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // データが取得できていない場合
  if (!categories) {
    return <ErrorMessage message="カテゴリの取得に失敗しました" />;
  }

  return <CategoryIndexView categories={categories} />;
}
