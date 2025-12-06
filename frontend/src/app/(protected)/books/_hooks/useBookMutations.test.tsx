import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient, createTestUuid } from '@/test/helpers';
import { createMockBook, createMockTopPageData } from '@/test/factories';
import { useBookMutations } from './useBookMutations';
import toast from 'react-hot-toast';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// next/navigationをモック
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('useBookMutations', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('createBook', () => {
    it('本の作成が成功する', async () => {
      const mockBook = createMockBook({ title: 'テスト本' });
      const queryClient = createTestQueryClient();

      // 事前にbooksリストとtopページのデータをキャッシュに追加
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockBook,
        }),
      );

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.createBook({
          title: 'テスト本',
          author_ids: [1],
          reading_status: 'completed',
          public: true,
        });
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isCreating).toBe(false));

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith(
        '/api/books',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'テスト本',
            author_ids: [1],
            reading_status: 'completed',
            public: true,
          }),
        }),
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('本を作成しました');

      // キャッシュが無効化されることを確認
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('本の作成が失敗する', async () => {
      const errorMessage = '本の作成に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.createBook({
          title: 'テスト本',
          author_ids: [1],
          reading_status: 'completed',
          public: true,
        });
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      // エラー状態を確認
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.createBook({
          title: 'テスト本',
          author_ids: [1],
          reading_status: 'completed',
          public: true,
        });
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      // エラー状態を確認
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe('Network error');
    });
  });

  describe('updateBook', () => {
    it('本の更新が成功する', async () => {
      const mockBook = createMockBook({ id: createTestUuid(1), title: '更新された本' });
      const queryClient = createTestQueryClient();

      // 事前にbooksとtopページのデータをキャッシュに追加
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(
        ['books', 'detail', createTestUuid(1)],
        [createMockBook({ id: createTestUuid(1) })],
      );
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockBook,
        }),
      );

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.updateBook({
          id: createTestUuid(1),
          title: '更新された本',
          author_ids: [1],
          reading_status: 'reading',
          public: false,
        });
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith(
        `/api/books/${createTestUuid(1)}`,
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: createTestUuid(1),
            title: '更新された本',
            author_ids: [1],
            reading_status: 'reading',
            public: false,
          }),
        }),
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('本を更新しました');

      // キャッシュが無効化されることを確認
      const booksQueryState = queryClient.getQueryState(['books']);
      const bookDetailState = queryClient.getQueryState(['books', 'detail', createTestUuid(1)]);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(bookDetailState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('本の更新が失敗する', async () => {
      const errorMessage = '本の更新に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.updateBook({
          id: createTestUuid(1),
          title: '更新された本',
          author_ids: [1],
          reading_status: 'reading',
          public: false,
        });
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      // エラー状態を確認
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.updateBook({
          id: createTestUuid(1),
          title: '更新された本',
          author_ids: [1],
          reading_status: 'reading',
          public: false,
        });
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      // エラー状態を確認
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe('Network error');

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });

  describe('deleteBook', () => {
    it('本の削除が成功する', async () => {
      const queryClient = createTestQueryClient();

      // 事前にbooksとtopページのデータをキャッシュに追加
      queryClient.setQueryData(['books'], [createMockBook({ id: createTestUuid(1) })]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ id: createTestUuid(1) }),
        }),
      );

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.deleteBook(createTestUuid(1));
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith(
        `/api/books/${createTestUuid(1)}`,
        expect.objectContaining({
          method: 'DELETE',
        }),
      );

      // リダイレクトが動作していることを確認
      expect(mockPush).toHaveBeenCalledWith('/books');

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('本を削除しました');

      // キャッシュが無効化されることを確認
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('本の削除が失敗する', async () => {
      const errorMessage = '本の削除に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.deleteBook(createTestUuid(1));
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      // エラー状態を確認
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.deleteBook(createTestUuid(1));
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      // エラー状態を確認
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError?.message).toBe('Network error');

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });
});
