import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { CardFormData } from '@/app/(protected)/cards/_types';

export function useCardMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: CardFormData) => {
      const response = await fetch(`/api/books/${data.book_id}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'カードの作成に失敗しました');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // カード一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      // 本詳細のキャッシュを無効化（カード一覧を含む）
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(variables.book_id) });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CardFormData) => {
      if (!data.id) {
        throw new Error('カードIDが必要です');
      }

      const response = await fetch(`/api/books/${data.book_id}/cards/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'カードの更新に失敗しました');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // カード一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      // カード詳細のキャッシュを無効化
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cards.detail(variables.id) });
      }
      // 本詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(variables.book_id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ bookId, cardId }: { bookId: number; cardId: number }) => {
      const response = await fetch(`/api/books/${bookId}/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'カードの削除に失敗しました');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // カード一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      // 本詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(variables.bookId) });
    },
  });

  return {
    createCard: createMutation.mutate,
    updateCard: updateMutation.mutate,
    deleteCard: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
