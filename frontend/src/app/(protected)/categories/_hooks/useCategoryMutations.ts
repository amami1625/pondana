import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import toast from 'react-hot-toast';
import { createCategory, updateCategory, deleteCategory } from '../_lib/mutation';

export function useCategoryMutations() {
  const queryClient = useQueryClient();

  // 作成
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('カテゴリを作成しました');
      // カテゴリ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success('カテゴリを更新しました');
      // カテゴリ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      // 本のキャッシュをすべて無効化（一覧・詳細の両方）
      // TODO: 現状どの本がこのカテゴリを使っているか判別できないため、パフォーマンスに問題が出てきたら修正する
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 削除
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('カテゴリを削除しました');
      // カテゴリ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      // 本のキャッシュをすべて無効化（一覧・詳細の両方）
      // TODO: 現状どの本がこのカテゴリを使っているか判別できないため、パフォーマンスに問題が出てきたら修正する
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
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
