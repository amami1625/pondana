import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { Card, CardFormData } from '@/app/(protected)/cards/_types';

// 更新用の型
type UpdateCardData = CardFormData & { id: number };

export function useCardMutations() {
  const queryClient = useQueryClient();

  // 作成
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

      return response.json() as Promise<Card>;
    },
    onSuccess: (_, { book_id }) => {
      // カード一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      // 本詳細のキャッシュを無効化（カード一覧を含む）
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(book_id) });
    },
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateCardData) => {
      const response = await fetch(`/api/books/${data.book_id}/cards/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'カードの更新に失敗しました');
      }

      return response.json() as Promise<Card>;
    },
    onSuccess: (_, { id, book_id }) => {
      // カード一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      // カード詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.detail(id) });
      // 本詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(book_id) });
    },
  });

  // 削除
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
    onSuccess: (_, { bookId }) => {
      // カード一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      // 本詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(bookId) });
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
