import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { Tag, TagFormData } from '@/app/(protected)/tags/_types';
import toast from 'react-hot-toast';

// 更新用の型
type UpdateTagData = TagFormData & { id: number };

export function useTagMutations() {
  const queryClient = useQueryClient();

  // 作成
  const createMutation = useMutation({
    mutationFn: async (data: TagFormData) => {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'タグの作成に失敗しました');
      }

      return response.json() as Promise<Tag>;
    },
    onSuccess: () => {
      toast.success('タグを作成しました');
      // タグ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateTagData) => {
      const { id, ...updateData } = data;
      const response = await fetch(`/api/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'タグの更新に失敗しました');
      }

      return response.json() as Promise<Tag>;
    },
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
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'タグの削除に失敗しました');
      }

      return response.json();
    },
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
