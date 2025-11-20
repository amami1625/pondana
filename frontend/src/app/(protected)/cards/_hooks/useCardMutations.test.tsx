import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient } from '@/test/helpers';
import { createMockBook, createMockCard, createMockTopPageData } from '@/test/factories';
import { useCardMutations } from './useCardMutations';
import toast from 'react-hot-toast';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCardMutations', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('createCard', () => {
    it('カードの作成が成功する', async () => {
      const mockCard = createMockCard({
        title: 'テストカード',
        content: 'テスト本文',
        book_id: 1,
      });
      const queryClient = createTestQueryClient();

      // 事前にcardsとbooks, topページのデータをキャッシュに追加
      queryClient.setQueryData(['cards'], [createMockCard({ id: 1 })]);
      queryClient.setQueryData(['books', 'detail', 1], createMockBook({ id: 1 }));
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockCard,
        }),
      );

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() =>
        result.current.createCard({
          book_id: 1,
          title: 'テストカード',
          content: 'テスト本文',
        }),
      );

      // 完了を待つ
      await waitFor(() => expect(result.current.isCreating).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/books/1/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: 1,
          title: 'テストカード',
          content: 'テスト本文',
        }),
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('カードを作成しました');

      // キャッシュが無効化されることを確認
      const cardsQueryState = queryClient.getQueryState(['cards']);
      const bookQueryState = queryClient.getQueryState(['books', 'detail', 1]);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(cardsQueryState?.isInvalidated).toBe(true);
      expect(bookQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('カードの作成が失敗する', async () => {
      const errorMessage = 'カードの作成に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() =>
        result.current.createCard({
          book_id: 1,
          title: 'テストカード',
          content: 'テスト本文',
        }),
      );

      // エラーを待つ
      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/books/1/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: 1,
          title: 'テストカード',
          content: 'テスト本文',
        }),
      });

      // エラー状態を確認
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() =>
        result.current.createCard({
          book_id: 1,
          title: 'テストカード',
          content: 'テスト本文',
        }),
      );

      // エラーを待つ
      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/books/1/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: 1,
          title: 'テストカード',
          content: 'テスト本文',
        }),
      });

      // エラー状態を確認
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe('Network error');

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });

  describe('updateCard', () => {
    it('カードの更新が成功する', async () => {
      const mockCard = createMockCard({
        id: 1,
        title: 'テストカード',
        content: 'テスト本文',
        book_id: 1,
      });
      const queryClient = createTestQueryClient();

      // 事前にcardsとbooks, topページのデータをキャッシュに追加
      queryClient.setQueryData(['cards'], [createMockCard({ id: 1 })]);
      queryClient.setQueryData(['cards', 'detail', 1], createMockCard({ id: 1 }));
      queryClient.setQueryData(['books', 'detail', 1], createMockBook({ id: 1 }));
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockCard,
        }),
      );

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() =>
        result.current.updateCard({
          id: 1,
          title: 'テストカード',
          content: 'テスト本文',
          book_id: 1,
        }),
      );

      // 完了を待つ
      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/books/1/cards/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          title: 'テストカード',
          content: 'テスト本文',
          book_id: 1,
        }),
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('カードを更新しました');

      // キャッシュが無効化されることを確認
      const cardsQueryState = queryClient.getQueryState(['cards']);
      const cardDetailQueryState = queryClient.getQueryState(['cards', 'detail', 1]);
      const bookQueryState = queryClient.getQueryState(['books', 'detail', 1]);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(cardsQueryState?.isInvalidated).toBe(true);
      expect(cardDetailQueryState?.isInvalidated).toBe(true);
      expect(bookQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('カードの更新が失敗する', async () => {
      const errorMessage = 'カードの更新に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() =>
        result.current.updateCard({
          id: 1,
          title: 'テストカード',
          content: 'テスト本文',
          book_id: 1,
        }),
      );

      // エラーを待つ
      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/books/1/cards/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          title: 'テストカード',
          content: 'テスト本文',
          book_id: 1,
        }),
      });

      // エラー状態を確認
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() =>
        result.current.updateCard({
          id: 1,
          title: 'テストカード',
          content: 'テスト本文',
          book_id: 1,
        }),
      );

      // エラーを待つ
      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/books/1/cards/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 1,
          title: 'テストカード',
          content: 'テスト本文',
          book_id: 1,
        }),
      });

      // エラー状態を確認
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe('Network error');

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });

  describe('deleteCard', () => {
    it('カードの削除が成功する', async () => {
      const mockCard = createMockCard({
        id: 1,
        title: 'テストカード',
        content: 'テスト本文',
        book_id: 1,
      });
      const queryClient = createTestQueryClient();

      // 事前にcardsとbooks, topページのデータをキャッシュに追加
      queryClient.setQueryData(['cards'], [createMockCard({ id: 1 })]);
      queryClient.setQueryData(['books', 'detail', 1], createMockBook({ id: 1 }));
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockCard,
        }),
      );

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      // ミューテーション実行
      act(() =>
        result.current.deleteCard({
          cardId: 1,
          bookId: 1,
        }),
      );

      // 完了を待つ
      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/books/1/cards/1', {
        method: 'DELETE',
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('カードを削除しました');

      // キャッシュが無効化されることを確認
      const cardsQueryState = queryClient.getQueryState(['cards']);
      const bookQueryState = queryClient.getQueryState(['books', 'detail', 1]);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(cardsQueryState?.isInvalidated).toBe(true);
      expect(bookQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('カードの削除が失敗する', async () => {
      const errorMessage = 'カードの削除に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      // ミューテーション実行
      act(() =>
        result.current.deleteCard({
          cardId: 1,
          bookId: 1,
        }),
      );

      // エラーを待つ
      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/books/1/cards/1', {
        method: 'DELETE',
      });

      // エラー状態を確認
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const { result } = renderHook(() => useCardMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      // ミューテーション実行
      act(() =>
        result.current.deleteCard({
          cardId: 1,
          bookId: 1,
        }),
      );

      // エラーを待つ
      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/books/1/cards/1', {
        method: 'DELETE',
      });

      // エラー状態を確認
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError?.message).toBe('Network error');

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });
});
