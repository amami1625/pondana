import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { Status, StatusFormData } from '@/app/(protected)/statuses/_types';
import toast from 'react-hot-toast';

// 更新用の型
type UpdateStatusData = StatusFormData & { id: number };

export function useStatusMutations() {
  const queryClient = useQueryClient();

  // 作成
  const createMutation = useMutation({
    mutationFn: async (data: StatusFormData) => {
      const response = await fetch('/api/statuses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'ステータスの作成に失敗しました');
      }

      return response.json() as Promise<Status>;
    },
    onSuccess: () => {
      toast.success('ステータスを作成しました');
      // ステータス一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.statuses.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateStatusData) => {
      const { id, ...updateData } = data;
      const response = await fetch(`/api/statuses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'ステータスの更新に失敗しました');
      }

      return response.json() as Promise<Status>;
    },
    onSuccess: () => {
      toast.success('ステータスを更新しました');
      // ステータス一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.statuses.all });

      // カードのキャッシュをすべて無効化（一覧・詳細の両方）
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 削除
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/statuses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'ステータスの削除に失敗しました');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('ステータスを削除しました');
      // ステータス一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.statuses.all });

      // カードのキャッシュをすべて無効化（一覧・詳細の両方）
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    createStatus: createMutation.mutate,
    updateStatus: updateMutation.mutate,
    deleteStatus: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
