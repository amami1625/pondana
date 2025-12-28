import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient } from '@/test/helpers';
import { createMockBook, createMockCategory, createMockTopPageData } from '@/test/factories';
import toast from 'react-hot-toast';
import { useCategoryMutations } from './useCategoryMutations';
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
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

describe('useCategoryMutations', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('createCategory', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const mockCategory = createMockCategory({ name: 'テストカテゴリ' });
      const queryClient = createTestQueryClient();
      const createData = { name: 'テストカテゴリ' };

      // 事前にcategoryのデータをキャッシュに追加
      queryClient.setQueryData(['categories'], [createMockCategory()]);

      // createCategory関数をモック
      vi.mocked(mutations.createCategory).mockResolvedValue(mockCategory);

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.createCategory(createData);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isCreating).toBe(false));

      // createCategory関数が正しく呼ばれたことを確認
      expect(mutations.createCategory).toHaveBeenCalled();
      expect(mutations.createCategory).toHaveBeenCalledWith(
        createData,
        expect.anything(), // React Queryが渡すコンテキスト
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('カテゴリを作成しました');

      // キャッシュが無効化されることを確認
      const categoriesQueryState = queryClient.getQueryState(['categories']);
      expect(categoriesQueryState?.isInvalidated).toBe(true);
    });

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = 'カテゴリの作成に失敗しました';

      vi.mocked(mutations.createCategory).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.createCategory({ name: 'テストカテゴリ' });
      });

      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.createError?.message).toBe(errorMessage);
    });
  });

  describe('updateCategory', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const mockCategory = createMockCategory({ id: 1, name: '更新されたカテゴリ' });
      const queryClient = createTestQueryClient();
      const updateData = { id: 1, name: '更新されたカテゴリ' };

      // 事前にcategoryとbook、topページのデータをキャッシュに追加
      queryClient.setQueryData(['categories'], [createMockCategory()]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      // updateCategory関数をモック
      vi.mocked(mutations.updateCategory).mockResolvedValue(mockCategory);

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.updateCategory(updateData);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      // updateCategory関数が正しく呼ばれたことを確認
      expect(mutations.updateCategory).toHaveBeenCalled();
      expect(mutations.updateCategory).toHaveBeenCalledWith(
        updateData,
        expect.anything(), // React Queryが渡すコンテキスト
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('カテゴリを更新しました');

      // キャッシュが無効化されることを確認
      const categoriesQueryState = queryClient.getQueryState(['categories']);
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(categoriesQueryState?.isInvalidated).toBe(true);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = 'カテゴリの更新に失敗しました';

      vi.mocked(mutations.updateCategory).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.updateCategory({ id: 1, name: 'テストカテゴリ' });
      });

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.updateError?.message).toBe(errorMessage);
    });
  });

  describe('deleteCategory', () => {
    it('成功時にonSuccessの副作用が実行される', async () => {
      const queryClient = createTestQueryClient();

      // 事前にcategoryとbook、topページのデータをキャッシュに追加
      queryClient.setQueryData(['categories'], [createMockCategory()]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      // deleteCategory関数をモック
      vi.mocked(mutations.deleteCategory).mockResolvedValue(undefined);

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.deleteCategory(1);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      // deleteCategory関数が正しく呼ばれたことを確認
      expect(mutations.deleteCategory).toHaveBeenCalled();
      expect(mutations.deleteCategory).toHaveBeenCalledWith(
        1,
        expect.anything(), // React Queryが渡すコンテキスト
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('カテゴリを削除しました');

      // キャッシュが無効化されることを確認
      const categoriesQueryState = queryClient.getQueryState(['categories']);
      const booksQueryState = queryClient.getQueryState(['books']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(categoriesQueryState?.isInvalidated).toBe(true);
      expect(booksQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('失敗時にonErrorの副作用が実行される', async () => {
      const errorMessage = 'カテゴリの削除に失敗しました';

      vi.mocked(mutations.deleteCategory).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.deleteCategory(1);
      });

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.deleteError?.message).toBe(errorMessage);
    });
  });
});
