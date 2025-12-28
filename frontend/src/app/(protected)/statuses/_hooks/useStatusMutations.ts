import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { StatusFormData } from '@/app/(protected)/statuses/_types';
import toast from 'react-hot-toast';
import { createStatus } from '@/app/(protected)/statuses/_lib/mutation/createStatus';
import {
  updateStatus,
  UpdateStatusData,
} from '@/app/(protected)/statuses/_lib/mutation/updateStatus';
import { deleteStatus } from '@/app/(protected)/statuses/_lib/mutation/deleteStatus';

export function useStatusMutations() {
  const queryClient = useQueryClient();

  // 作成
  const createMutation = useMutation({
    mutationFn: (data: StatusFormData) => createStatus(data),
    onSuccess: () => {
      toast.success('ステータスを作成しました');
      // ステータス一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.statuses.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: (data: UpdateStatusData) => updateStatus(data),
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
    mutationFn: (id: number) => deleteStatus(id),
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
