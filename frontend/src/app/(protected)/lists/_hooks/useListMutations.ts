import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { ListBase, ListFormData } from '@/app/(protected)/lists/_types';
import { useRouter } from 'next/navigation';

// 作成用の型
type CreateListData = Pick<ListFormData, 'name' | 'description' | 'public'>;

// 更新用の型
type UpdateListData = Pick<ListFormData, 'id' | 'name' | 'description' | 'public'>;

export function useListMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 作成
  const createMutation = useMutation({
    mutationFn: async (data: CreateListData) => {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'リストの作成に失敗しました');
      }

      return response.json() as Promise<ListBase>;
    },
    onSuccess: () => {
      // リスト一覧を再取得
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
    },
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateListData) => {
      const response = await fetch(`/api/lists/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'リストの更新に失敗しました');
      }

      return response.json() as Promise<ListBase>;
    },
    onSuccess: () => {
      // リスト関連のキャッシュを全て無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/lists/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'リストの削除に失敗しました');
      }

      return id; // 削除したIDを返す
    },
    onSuccess: () => {
      // 一覧ページにリダイレクト
      router.push('/lists');

      // リスト一覧のキャッシュのみを無効化（exact: true で詳細キャッシュは対象外）
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists.all,
        exact: true,
      });
    },
  });

  return {
    createList: createMutation.mutate,
    updateList: updateMutation.mutate,
    deleteList: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
