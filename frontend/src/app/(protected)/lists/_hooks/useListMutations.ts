import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { queryKeys } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createList, updateList, deleteList } from '../_lib/mutation';

export function useListMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 作成
  const createMutation = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      toast.success('リストを作成しました');
      // リスト一覧を再取得
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: updateList,
    onSuccess: (_, { id }) => {
      toast.success('リストを更新しました');
      // リスト一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
      // リスト詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.lists.detail(id) });
      // 書籍のキャッシュを無効化
      // TODO: リストを使用していた書籍のキャッシュのみ無効化するように最適化する
      queryClient.invalidateQueries({
        queryKey: queryKeys.books.all,
      });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 削除
  const deleteMutation = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      toast.success('リストを削除しました');

      // リスト一覧のキャッシュのみを無効化（詳細キャッシュは対象外）
      queryClient.invalidateQueries({
        queryKey: queryKeys.lists.all,
        exact: true,
      });
      // 書籍のキャッシュを無効化
      // TODO: リストを使用していた書籍のキャッシュのみ無効化するように最適化する
      queryClient.invalidateQueries({
        queryKey: queryKeys.books.all,
      });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });

      // 一覧ページにリダイレクト
      router.push('/lists');
    },
    onError: (error) => toast.error(error.message),
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
