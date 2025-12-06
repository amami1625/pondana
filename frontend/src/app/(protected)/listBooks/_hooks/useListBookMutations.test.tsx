import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient, createTestUuid } from '@/test/helpers';
import {
  createMockListBook,
  createMockBook,
  createMockList,
  createMockTopPageData,
} from '@/test/factories';
import { useListBookMutations } from './useListBookMutations';
import toast from 'react-hot-toast';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useListBookMutations', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('addListBook', () => {
    it('リストへの本の追加に成功する', async () => {
      const mockListBook = createMockListBook({
        list_id: createTestUuid(1),
        book_id: createTestUuid(1),
      });
      const queryClient = createTestQueryClient();

      // 事前にlists、books、topページのデータをキャッシュに追加
      queryClient.setQueryData(['lists'], [createMockList()]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockListBook,
        }),
      );

      const { result } = renderHook(() => useListBookMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isAdding).toBe(false);
      expect(result.current.addError).toBeNull();

      act(() =>
        result.current.addListBook({
          list_id: createTestUuid(1),
          book_id: createTestUuid(1),
        }),
      );

      await waitFor(() => expect(result.current.isAdding).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/list_books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          list_id: createTestUuid(1),
          book_id: createTestUuid(1),
        }),
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('リストに本を追加しました');

      // キャッシュが無効化されることを確認
      const listsQueryState = queryClient.getQueryState(['lists']);
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(listsQueryState?.isInvalidated).toBe(true);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('リストへの本の追加に失敗する', async () => {
      const errorMessage = 'リストへの本の追加に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useListBookMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isAdding).toBe(false);
      expect(result.current.addError).toBeNull();

      act(() =>
        result.current.addListBook({
          list_id: createTestUuid(1),
          book_id: createTestUuid(1),
        }),
      );

      await waitFor(() => expect(result.current.addError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/list_books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          list_id: createTestUuid(1),
          book_id: createTestUuid(1),
        }),
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isAdding).toBe(false);
      expect(result.current.addError?.message).toBe(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      const errorMessage = 'Network error';

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(errorMessage)));

      const { result } = renderHook(() => useListBookMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isAdding).toBe(false);
      expect(result.current.addError).toBeNull();

      act(() =>
        result.current.addListBook({
          list_id: createTestUuid(1),
          book_id: createTestUuid(1),
        }),
      );

      await waitFor(() => expect(result.current.addError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/list_books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          list_id: createTestUuid(1),
          book_id: createTestUuid(1),
        }),
      });

      expect(result.current.isAdding).toBe(false);
      expect(result.current.addError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('removeListBook', () => {
    it('リストからの本の削除に成功する', async () => {
      const mockListBook = createMockListBook({ id: 1 });
      const queryClient = createTestQueryClient();

      // 事前にlists、books、topページのデータをキャッシュに追加
      queryClient.setQueryData(['lists'], [createMockList()]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockListBook,
        }),
      );

      const { result } = renderHook(() => useListBookMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isRemoving).toBe(false);
      expect(result.current.removeError).toBeNull();

      act(() => result.current.removeListBook({ id: 1 }));

      await waitFor(() => expect(result.current.isRemoving).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/list_books/1', {
        method: 'DELETE',
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('リストから本を削除しました');

      // キャッシュが無効化されることを確認
      const listsQueryState = queryClient.getQueryState(['lists']);
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(listsQueryState?.isInvalidated).toBe(true);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('リストからの本の削除に失敗する', async () => {
      const errorMessage = 'リストからの本の削除に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useListBookMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isRemoving).toBe(false);
      expect(result.current.removeError).toBeNull();

      act(() => result.current.removeListBook({ id: 1 }));

      await waitFor(() => expect(result.current.removeError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/list_books/1', {
        method: 'DELETE',
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isRemoving).toBe(false);
      expect(result.current.removeError?.message).toBe(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      const errorMessage = 'Network error';

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(errorMessage)));

      const { result } = renderHook(() => useListBookMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isRemoving).toBe(false);
      expect(result.current.removeError).toBeNull();

      act(() => result.current.removeListBook({ id: 1 }));

      await waitFor(() => expect(result.current.removeError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/list_books/1', {
        method: 'DELETE',
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isRemoving).toBe(false);
      expect(result.current.removeError?.message).toBe(errorMessage);
    });
  });
});
