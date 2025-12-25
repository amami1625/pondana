import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient, createTestUuid } from '@/test/helpers';
import { createMockBook, createMockCard, createMockTopPageData } from '@/test/factories';
import { useCardMutations } from './useCardMutations';
import toast from 'react-hot-toast';
import * as mutations from '../_lib/mutation';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// ミューテーション関数をモック
vi.mock('../_lib/mutation', () => ({
  createCard: vi.fn(),
  updateCard: vi.fn(),
  deleteCard: vi.fn(),
}));

describe('useCardMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCard', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const mockCard = createMockCard({
        title: 'テストカード',
        content: 'テスト本文',
        book_id: createTestUuid(1),
      });
      const queryClient = createTestQueryClient();
      const createData = {
        book_id: createTestUuid(1),
        title: 'テストカード',
        content: 'テスト本文',
      };

      // 事前にcardsとbooks, topページのデータをキャッシュに追加
      queryClient.setQueryData(['cards'], [createMockCard({ id: createTestUuid(1) })]);
      queryClient.setQueryData(
        ['books', 'detail', createTestUuid(1)],
        createMockBook({ id: createTestUuid(1) }),
      );
      queryClient.setQueryData(['top'], createMockTopPageData());

      // createCard関数をモック
      vi.mocked(mutations.createCard).mockResolvedValue(mockCard);

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.createCard(createData);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isCreating).toBe(false));

      // createCard関数が正しく呼ばれたことを確認
      expect(mutations.createCard).toHaveBeenCalledWith(createData);

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('カードを作成しました');

      // キャッシュが無効化されることを確認
      const cardsQueryState = queryClient.getQueryState(['cards']);
      const bookQueryState = queryClient.getQueryState(['books', 'detail', createTestUuid(1)]);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(cardsQueryState?.isInvalidated).toBe(true);
      expect(bookQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = 'カードの作成に失敗しました';
      const createData = {
        book_id: createTestUuid(1),
        title: 'テストカード',
        content: 'テスト本文',
      };

      // createCard関数をエラーをスローするようにモック
      vi.mocked(mutations.createCard).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      // ミューテーション実行
      act(() => {
        result.current.createCard(createData);
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      // createCard関数が正しく呼ばれたことを確認
      expect(mutations.createCard).toHaveBeenCalledWith(createData);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updateCard', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const mockCard = createMockCard({
        id: createTestUuid(1),
        title: 'テストカード',
        content: 'テスト本文',
        book_id: createTestUuid(1),
      });
      const queryClient = createTestQueryClient();
      const updateData = {
        id: createTestUuid(1),
        title: 'テストカード',
        content: 'テスト本文',
        book_id: createTestUuid(1),
      };

      // 事前にcardsとbooks, topページのデータをキャッシュに追加
      queryClient.setQueryData(['cards'], [createMockCard({ id: createTestUuid(1) })]);
      queryClient.setQueryData(
        ['cards', 'detail', createTestUuid(1)],
        createMockCard({ id: createTestUuid(1) }),
      );
      queryClient.setQueryData(
        ['books', 'detail', createTestUuid(1)],
        createMockBook({ id: createTestUuid(1) }),
      );
      queryClient.setQueryData(['top'], createMockTopPageData());

      // updateCard関数をモック
      vi.mocked(mutations.updateCard).mockResolvedValue(mockCard);

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.updateCard(updateData);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      // updateCard関数が正しく呼ばれたことを確認
      expect(mutations.updateCard).toHaveBeenCalledWith(updateData);

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('カードを更新しました');

      // キャッシュが無効化されることを確認
      const cardsQueryState = queryClient.getQueryState(['cards']);
      const cardDetailQueryState = queryClient.getQueryState([
        'cards',
        'detail',
        createTestUuid(1),
      ]);
      const bookQueryState = queryClient.getQueryState(['books', 'detail', createTestUuid(1)]);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(cardsQueryState?.isInvalidated).toBe(true);
      expect(cardDetailQueryState?.isInvalidated).toBe(true);
      expect(bookQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = 'カードの更新に失敗しました';
      const updateData = {
        id: createTestUuid(1),
        title: 'テストカード',
        content: 'テスト本文',
        book_id: createTestUuid(1),
      };

      // updateCard関数をエラーをスローするようにモック
      vi.mocked(mutations.updateCard).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      // ミューテーション実行
      act(() => {
        result.current.updateCard(updateData);
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      // updateCard関数が正しく呼ばれたことを確認
      expect(mutations.updateCard).toHaveBeenCalledWith(updateData);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('deleteCard', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const queryClient = createTestQueryClient();
      const bookId = createTestUuid(1);
      const cardId = createTestUuid(2);

      // 事前にcardsとbooks, topページのデータをキャッシュに追加
      queryClient.setQueryData(['cards'], [createMockCard({ id: cardId })]);
      queryClient.setQueryData(['books', 'detail', bookId], createMockBook({ id: bookId }));
      queryClient.setQueryData(['top'], createMockTopPageData());

      // deleteCard関数をモック
      vi.mocked(mutations.deleteCard).mockResolvedValue(undefined);

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.deleteCard({ cardId, bookId });
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      // deleteCard関数が正しく呼ばれたことを確認
      expect(mutations.deleteCard).toHaveBeenCalledWith(bookId, cardId);

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('カードを削除しました');

      // キャッシュが無効化されることを確認
      const cardsQueryState = queryClient.getQueryState(['cards']);
      const bookQueryState = queryClient.getQueryState(['books', 'detail', bookId]);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(cardsQueryState?.isInvalidated).toBe(true);
      expect(bookQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = 'カードの削除に失敗しました';
      const bookId = createTestUuid(1);
      const cardId = createTestUuid(2);

      // deleteCard関数をエラーをスローするようにモック
      vi.mocked(mutations.deleteCard).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      // ミューテーション実行
      act(() => {
        result.current.deleteCard({ cardId, bookId });
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      // deleteCard関数が正しく呼ばれたことを確認
      expect(mutations.deleteCard).toHaveBeenCalledWith(bookId, cardId);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
