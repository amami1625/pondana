import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { BookCreateData, BookUpdateData } from '@/app/(protected)/books/_types';
import { createBook, deleteBook, updateBook } from '../_lib/mutation';
import toast from 'react-hot-toast';

export function useBookMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 作成
  const createMutation = useMutation({
    mutationFn: (data: BookCreateData) => createBook(data),
    onSuccess: () => {
      toast.success('本を登録しました');
      // 書籍一覧を再取得
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: (data: BookUpdateData) => updateBook(data),
    onSuccess: (_, { id }) => {
      toast.success('本を更新しました');
      // 書籍一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      // 書籍詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(id) });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 削除
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => {
      toast.success('本を削除しました');
      // 一覧ページにリダイレクト
      router.push('/books');

      // 書籍一覧のキャッシュのみを無効化（exact: true で詳細キャッシュは対象外）
      queryClient.invalidateQueries({
        queryKey: queryKeys.books.all,
        exact: true,
      });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    createBook: createMutation.mutate,
    updateBook: updateMutation.mutate,
    deleteBook: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
