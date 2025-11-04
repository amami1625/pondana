import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { BookBase, BookFormData } from '@/app/(protected)/books/_types';
import { useRouter } from 'next/navigation';

// 作成用の型
type CreateBookData = Pick<
  BookFormData,
  'title' | 'description' | 'author_ids' | 'category_id' | 'rating' | 'reading_status' | 'public'
>;

// 更新用の型
type UpdateBookData = Pick<
  BookFormData,
  | 'id'
  | 'title'
  | 'description'
  | 'author_ids'
  | 'category_id'
  | 'rating'
  | 'reading_status'
  | 'public'
>;

export function useBookMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 作成
  const createMutation = useMutation({
    mutationFn: async (data: CreateBookData) => {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '書籍の作成に失敗しました');
      }

      return response.json() as Promise<BookBase>;
    },
    onSuccess: () => {
      // 書籍一覧を再取得
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
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
        throw new Error(error.error || '書籍の更新に失敗しました');
      }

      return response.json() as Promise<BookBase>;
    },
    onSuccess: () => {
      // 書籍関連のキャッシュを全て無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/books/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '書籍の削除に失敗しました');
      }

      return id;
    },
    onSuccess: () => {
      // 一覧ページにリダイレクト
      router.push('/books');

      // 書籍一覧のキャッシュのみを無効化（exact: true で詳細キャッシュは対象外）
      queryClient.invalidateQueries({
        queryKey: queryKeys.books.all,
        exact: true,
      });
    },
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
