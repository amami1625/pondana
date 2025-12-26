import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient, createTestUuid } from '@/test/helpers';
import { createMockBook, createMockTopPageData } from '@/test/factories';
import { useBookMutations } from './useBookMutations';
import toast from 'react-hot-toast';
import * as mutations from '../_lib/mutation';

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

// ミューテーション関数をモック
vi.mock('../_lib/mutation', () => ({
  createBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn(),
}));

describe('useBookMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBook', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const mockBook = createMockBook({ title: 'テスト本' });
      const queryClient = createTestQueryClient();
      const createData = {
        title: 'テスト本',
        reading_status: 'completed' as const,
        public: true,
      };

      // 事前にbooksリストとtopページのデータをキャッシュに追加
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      // createBook関数をモック
      vi.mocked(mutations.createBook).mockResolvedValue(mockBook);

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.createBook(createData);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isCreating).toBe(false));

      // createBook関数が正しく呼ばれたことを確認
      expect(mutations.createBook).toHaveBeenCalledWith(
        createData,
        expect.anything(), // React Queryが渡すコンテキスト
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('本を登録しました');

      // キャッシュが無効化されることを確認
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = '本の登録に失敗しました';
      const createData = {
        title: 'テスト本',
        reading_status: 'completed' as const,
        public: true,
      };

      // createBook関数をエラーをスローするようにモック
      vi.mocked(mutations.createBook).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      // ミューテーション実行
      act(() => {
        result.current.createBook(createData);
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      // createBook関数が正しく呼ばれたことを確認
      expect(mutations.createBook).toHaveBeenCalledWith(
        createData,
        expect.anything(), // React Queryが渡すコンテキスト
      );

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updateBook', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const mockBook = createMockBook({ id: createTestUuid(1), title: '更新された本' });
      const queryClient = createTestQueryClient();
      const updateData = {
        id: createTestUuid(1),
        description: '更新された説明',
        rating: 4,
        reading_status: 'reading' as const,
        public: false,
      };

      // 事前にbooksとtopページのデータをキャッシュに追加
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(
        ['books', 'detail', createTestUuid(1)],
        createMockBook({ id: createTestUuid(1) }),
      );
      queryClient.setQueryData(['top'], createMockTopPageData());

      // updateBook関数をモック
      vi.mocked(mutations.updateBook).mockResolvedValue(mockBook);

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.updateBook(updateData);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      // updateBook関数が正しく呼ばれたことを確認
      expect(mutations.updateBook).toHaveBeenCalledWith(
        updateData,
        expect.anything(), // React Queryが渡すコンテキスト
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

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = '本の更新に失敗しました';
      const updateData = {
        id: createTestUuid(1),
        reading_status: 'reading' as const,
        public: false,
      };

      // updateBook関数をエラーをスローするようにモック
      vi.mocked(mutations.updateBook).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      // ミューテーション実行
      act(() => {
        result.current.updateBook(updateData);
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      // updateBook関数が正しく呼ばれたことを確認
      expect(mutations.updateBook).toHaveBeenCalledWith(
        updateData,
        expect.anything(), // React Queryが渡すコンテキスト
      );

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('deleteBook', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const queryClient = createTestQueryClient();
      const bookId = createTestUuid(1);

      // 事前にbooksとtopページのデータをキャッシュに追加
      queryClient.setQueryData(['books'], [createMockBook({ id: bookId })]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      // deleteBook関数をモック
      vi.mocked(mutations.deleteBook).mockResolvedValue(undefined);

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.deleteBook({ id: bookId });
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      // deleteBook関数が正しく呼ばれたことを確認
      expect(mutations.deleteBook).toHaveBeenCalledWith(
        { id: bookId },
        expect.anything(), // React Queryが渡すコンテキスト
      );

      // リダイレクトが動作していることを確認
      expect(mockPush).toHaveBeenCalledWith('/books');

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('本を削除しました');

      // キャッシュが無効化されることを確認（exact: true のため詳細は無効化されない）
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = '本の削除に失敗しました';
      const bookId = createTestUuid(1);

      // deleteBook関数をエラーをスローするようにモック
      vi.mocked(mutations.deleteBook).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      // ミューテーション実行
      act(() => {
        result.current.deleteBook({ id: bookId });
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      // deleteBook関数が正しく呼ばれたことを確認
      expect(mutations.deleteBook).toHaveBeenCalledWith(
        { id: bookId },
        expect.anything(), // React Queryが渡すコンテキスト
      );

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      // エラー時はリダイレクトされないことを確認
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
