import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient } from '@/test/helpers';
import { createMockBook, createMockCategory, createMockTopPageData } from '@/test/factories';
import toast from 'react-hot-toast';
import { useCategoryMutations } from './useCategoryMutations';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCategoryMutations', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('createCategory', () => {
    it('カテゴリの作成に成功する', async () => {
      const mockCategory = createMockCategory({ name: 'テストカテゴリ' });
      const queryClient = createTestQueryClient();

      // 事前にcategoryのデータをキャッシュに追加
      queryClient.setQueryData(['categories'], [createMockCategory()]);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockCategory,
        }),
      );

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      act(() =>
        result.current.createCategory({
          name: 'テストカテゴリ',
        }),
      );

      await waitFor(() => expect(result.current.isCreating).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'テストカテゴリ',
        }),
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('カテゴリを作成しました');

      // キャッシュが無効化されることを確認
      const categoriesQueryState = queryClient.getQueryState(['categories']);
      expect(categoriesQueryState?.isInvalidated).toBe(true);
    });

    it('カテゴリの作成に失敗する', async () => {
      const errorMessage = 'カテゴリの作成に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      act(() =>
        result.current.createCategory({
          name: 'テストカテゴリ',
        }),
      );

      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'テストカテゴリ',
        }),
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      act(() =>
        result.current.createCategory({
          name: 'テストカテゴリ',
        }),
      );

      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'テストカテゴリ',
        }),
      });

      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe('Network error');

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });

  describe('updateCategory', () => {
    it('カテゴリの更新に成功する', async () => {
      const mockCategory = createMockCategory({ id: 1, name: 'テストカテゴリ' });
      const queryClient = createTestQueryClient();

      // 事前にcategoryとbook、topページのデータをキャッシュに追加
      queryClient.setQueryData(['categories'], [createMockCategory()]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockCategory,
        }),
      );

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      act(() => result.current.updateCategory({ id: 1, name: 'テストカテゴリ' }));

      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/categories/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'テストカテゴリ' }),
      });

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

    it('カテゴリの更新に失敗する', async () => {
      const errorMessage = 'カテゴリの更新に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      act(() => result.current.updateCategory({ id: 1, name: 'テストカテゴリ' }));

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/categories/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'テストカテゴリ' }),
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      const errorMessage = 'Network error';

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(errorMessage)));

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      act(() => result.current.updateCategory({ id: 1, name: 'テストカテゴリ' }));

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/categories/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'テストカテゴリ' }),
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe(errorMessage);
    });
  });

  describe('deleteCategory', () => {
    it('カテゴリの削除に成功する', async () => {
      const mockCategory = createMockCategory({ id: 1 });
      const queryClient = createTestQueryClient();

      // 事前にcategoryとbook、topページのデータをキャッシュに追加
      queryClient.setQueryData(['categories'], [createMockCategory()]);
      queryClient.setQueryData(['books'], [createMockBook()]);
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockCategory,
        }),
      );

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      act(() => result.current.deleteCategory(1));

      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/categories/1', {
        method: 'DELETE',
      });

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

    it('カテゴリの削除に失敗する', async () => {
      const errorMessage = 'カテゴリの削除に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      act(() => result.current.deleteCategory(1));

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/categories/1', {
        method: 'DELETE',
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError?.message).toBe(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      const errorMessage = 'Network error';

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(errorMessage)));

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      act(() => result.current.deleteCategory(1));

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/categories/1', {
        method: 'DELETE',
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError?.message).toBe(errorMessage);
    });
  });
});
