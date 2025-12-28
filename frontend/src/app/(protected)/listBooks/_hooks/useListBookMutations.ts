import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import toast from 'react-hot-toast';
import { addListBook, removeListBook } from '../_lib/mutation';

export function useListBookMutations() {
  const queryClient = useQueryClient();

  // リストに本を追加
  const addMutation = useMutation({
    mutationFn: addListBook,
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
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // リストから本を削除
  const removeMutation = useMutation({
    mutationFn: removeListBook,
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
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
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
