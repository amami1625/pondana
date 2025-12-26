import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
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
    vi.clearAllMocks();
  });

  describe('addListBook', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const mockListBook = createMockListBook({
        list_id: createTestUuid(1),
        book_id: createTestUuid(1),
      });
      const queryClient = createTestQueryClient();
      const addData = {
        list_id: createTestUuid(1),
        book_id: createTestUuid(1),
      };

      // 事前にlists、books、topページのデータをキャッシュに追加
      queryClient.setQueryData(['lists'], [createMockList()]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      // MSWでAPIレスポンスをモック
      server.use(
        http.post('/api/list_books', async () => {
          return HttpResponse.json(mockListBook, { status: 201 });
        }),
      );

      const { result } = renderHook(() => useListBookMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.addListBook(addData);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isAdding).toBe(false));

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

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = 'リストへの本の追加に失敗しました';
      const addData = {
        list_id: createTestUuid(1),
        book_id: createTestUuid(1),
      };

      // MSWでエラーレスポンスをモック
      server.use(
        http.post('/api/list_books', async () => {
          return HttpResponse.json(
            {
              code: 'ADD_FAILED',
              error: errorMessage,
            },
            { status: 422 },
          );
        }),
      );

      const { result } = renderHook(() => useListBookMutations(), {
        wrapper: createProvider(),
      });

      // ミューテーション実行
      act(() => {
        result.current.addListBook(addData);
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.addError).toBeInstanceOf(Error));

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('removeListBook', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const queryClient = createTestQueryClient();
      const removeData = { id: 1 };

      // 事前にlists、books、topページのデータをキャッシュに追加
      queryClient.setQueryData(['lists'], [createMockList()]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      // MSWでAPIレスポンスをモック
      server.use(
        http.delete('/api/list_books/:id', () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );

      const { result } = renderHook(() => useListBookMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.removeListBook(removeData);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isRemoving).toBe(false));

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

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = 'リストからの本の削除に失敗しました';
      const removeData = { id: 1 };

      // MSWでエラーレスポンスをモック
      server.use(
        http.delete('/api/list_books/:id', () => {
          return HttpResponse.json(
            {
              code: 'REMOVE_FAILED',
              error: errorMessage,
            },
            { status: 422 },
          );
        }),
      );

      const { result } = renderHook(() => useListBookMutations(), {
        wrapper: createProvider(),
      });

      // ミューテーション実行
      act(() => {
        result.current.removeListBook(removeData);
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.removeError).toBeInstanceOf(Error));

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
