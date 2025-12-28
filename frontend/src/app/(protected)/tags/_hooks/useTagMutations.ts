import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import toast from 'react-hot-toast';
import { createTag, updateTag, deleteTag } from '../_lib/mutation';

export function useTagMutations() {
  const queryClient = useQueryClient();

  // 作成
  const createMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      toast.success('タグを作成しました');
      // タグ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: updateTag,
    onSuccess: () => {
      toast.success('タグを更新しました');
      // タグ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });

      // 本のキャッシュをすべて無効化（一覧・詳細の両方）
      // TODO: 現状どの本がこのタグを使っているか判別できないため、パフォーマンスに問題が出てきたら修正する
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });

      // トップページデータのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 削除
  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      toast.success('タグを削除しました');
      // タグ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });

      // 本のキャッシュをすべて無効化（一覧・詳細の両方）
      // TODO: 現状どの本がこのタグを使っているか判別できないため、パフォーマンスに問題が出てきたら修正する
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });

      // トップページデータのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    createTag: createMutation.mutate,
    updateTag: updateMutation.mutate,
    deleteTag: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
