import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { BookBase, BookFormData } from '@/app/(protected)/books/_types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// 更新用の型
type UpdateBookData = BookFormData & { id: string };

export function useBookMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 作成
  const createMutation = useMutation({
    mutationFn: async (data: BookFormData) => {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '本の作成に失敗しました');
      }

      return response.json() as Promise<BookBase>;
    },
    onSuccess: () => {
      toast.success('本を作成しました');
      // 書籍一覧を再取得
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateBookData) => {
      const response = await fetch(`/api/books/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '本の更新に失敗しました');
      }

      return response.json() as Promise<BookBase>;
    },
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
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/books/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '本の削除に失敗しました');
      }

      return response.json();
    },
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
