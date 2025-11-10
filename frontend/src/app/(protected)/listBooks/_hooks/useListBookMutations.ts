import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { ListBook, ListBookFormData } from '@/app/(protected)/listBooks/_types';
import toast from 'react-hot-toast';

export function useListBookMutations() {
  const queryClient = useQueryClient();

  // リストに本を追加
  const addMutation = useMutation({
    mutationFn: async (data: ListBookFormData) => {
      const response = await fetch('/api/list_books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'リストへの本の追加に失敗しました');
      }

      return response.json() as Promise<ListBook>;
    },
    onSuccess: () => {
      toast.success('リストに本を追加しました');
      // リスト一覧のキャッシュを無効化（AddListModal の isAdded 更新のため）
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists.all,
      });
      // 本一覧のキャッシュを無効化（AddBookModal の isAdded 更新のため）
      queryClient.invalidateQueries({
        queryKey: queryKeys.books.all,
      });
    },
  });

  // リストから本を削除
  const removeMutation = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const response = await fetch(`/api/list_books/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'リストからの本の削除に失敗しました');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('リストから本を削除しました');
      // すべてのリスト詳細のキャッシュを無効化（どのリストから削除されたか分からないため）
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists.all,
      });
      // すべての本詳細のキャッシュを無効化（どの本が削除されたか分からないため）
      queryClient.invalidateQueries({
        queryKey: queryKeys.books.all,
      });
    },
  });

  return {
    addListBook: addMutation.mutate,
    removeListBook: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    addError: addMutation.error,
    removeError: removeMutation.error,
  };
}
