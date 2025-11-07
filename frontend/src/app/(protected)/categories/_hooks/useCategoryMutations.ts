import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { Category, CategoryFormData } from '@/app/(protected)/categories/_types';

// 更新用の型
type UpdateCategoryData = CategoryFormData & { id: number };

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  // 作成
  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'カテゴリの作成に失敗しました');
      }

      return response.json() as Promise<Category>;
    },
    onSuccess: () => {
      // カテゴリ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateCategoryData) => {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'カテゴリの更新に失敗しました');
      }

      return response.json() as Promise<Category>;
    },
    onSuccess: () => {
      // カテゴリ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      // 本のキャッシュをすべて無効化（一覧・詳細の両方）
      // TODO: 現状どの本がこのカテゴリを使っているか判別できないため、パフォーマンスに問題が出てきたら修正する
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });

  // 削除
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'カテゴリの削除に失敗しました');
      }

      return response.json();
    },
    onSuccess: () => {
      // カテゴリ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      // 本のキャッシュをすべて無効化（一覧・詳細の両方）
      // TODO: 現状どの本がこのカテゴリを使っているか判別できないため、パフォーマンスに問題が出てきたら修正する
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });

  return {
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
