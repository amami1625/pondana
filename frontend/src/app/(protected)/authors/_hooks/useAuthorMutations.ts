import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { Author, AuthorFormData } from '@/app/(protected)/authors/_types';
import toast from 'react-hot-toast';

// 更新用の型
type UpdateAuthorData = AuthorFormData & { id: number };

export function useAuthorMutations() {
  const queryClient = useQueryClient();

  // 作成
  const createMutation = useMutation({
    mutationFn: async (data: AuthorFormData) => {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '著者の作成に失敗しました');
      }

      return response.json() as Promise<Author>;
    },

    onSuccess: () => {
      toast.success('著者を作成しました');
      // 著者一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.authors.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateAuthorData) => {
      const response = await fetch('/api/authors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '著者の更新に失敗しました');
      }

      return response.json() as Promise<Author>;
    },

    onSuccess: () => {
      toast.success('著者を更新しました');
      // 著者一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.authors.all });
      // 本のキャッシュをすべて無効化（一覧・詳細の両方）
      // TODO: 現状どの本がこの著者データを使っているか判別できないため、パフォーマンスに問題が出てきたら修正する
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 削除
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/authors?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '著者の削除に失敗しました');
      }

      return response.json();
    },

    onSuccess: () => {
      toast.success('著者を削除しました');
      // 著者一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.authors.all });
      // 本のキャッシュをすべて無効化（一覧・詳細の両方）
      // TODO: 現状どの本がこの著者データを使っているか判別できないため、パフォーマンスに問題が出てきたら修正する
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    createAuthor: createMutation.mutate,
    updateAuthor: updateMutation.mutate,
    deleteAuthor: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
