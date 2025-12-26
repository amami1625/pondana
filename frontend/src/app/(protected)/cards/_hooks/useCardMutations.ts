import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { CardFormData } from '@/app/(protected)/cards/_types';
import toast from 'react-hot-toast';
import { createCard, updateCard, deleteCard } from '../_lib/mutation';

// 更新用の型
type UpdateCardData = CardFormData & { id: string };

export function useCardMutations() {
  const queryClient = useQueryClient();

  // 作成
  const createMutation = useMutation({
    mutationFn: createCard,
    onSuccess: (_, { book_id }) => {
      toast.success('カードを作成しました');
      // カード一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      // 本詳細のキャッシュを無効化（カード一覧を含む）
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(book_id) });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 更新
  const updateMutation = useMutation({
    mutationFn: updateCard,
    onSuccess: (_, { id, book_id }) => {
      toast.success('カードを更新しました');
      // カード一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      // カード詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.detail(id) });
      // 本詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(book_id) });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  // 削除
  const deleteMutation = useMutation({
    mutationFn: deleteCard,
    onSuccess: (_, { bookId }) => {
      toast.success('カードを削除しました');
      // カード一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.cards.all });
      // 本詳細のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(bookId) });
      // トップページのキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
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
