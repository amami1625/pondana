import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient } from '@/test/helpers';
import { createMockAuthor } from '@/test/factories';
import { useAuthorMutations } from './useAuthorMutations';
import toast from 'react-hot-toast';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useAuthorMutations', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('createAuthor', () => {
    it('著者作成が成功する', async () => {
      const mockAuthor = createMockAuthor({ name: 'テスト著者' });
      const queryClient = createTestQueryClient();

      // 事前にauthorsリストをキャッシュに追加
      queryClient.setQueryData(['authors'], [createMockAuthor({ id: 1 })]);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockAuthor,
        }),
      );

      const { result } = renderHook(() => useAuthorMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.createAuthor({ name: 'テスト著者' });
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isCreating).toBe(false));

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith(
        '/api/authors',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'テスト著者' }),
        }),
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('著者を作成しました');

      // キャッシュが無効化されることを確認
      const queryState = queryClient.getQueryState(['authors']);
      expect(queryState?.isInvalidated).toBe(true);
    });

    it('著者作成が失敗する', async () => {
      const errorMessage = '著者の作成に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useAuthorMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.createAuthor({ name: 'テスト著者' });
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

      const { result } = renderHook(() => useAuthorMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.createAuthor({ name: 'テスト著者' });
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      // エラー状態を確認
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError?.message).toBe('Network error');

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });

  describe('updateAuthor', () => {
    it('著者更新が成功する', async () => {
      const mockAuthor = createMockAuthor({ id: 1, name: '更新された著者' });
      const queryClient = createTestQueryClient();

      // 事前にauthorsリストをキャッシュに追加
      queryClient.setQueryData(['authors'], [createMockAuthor({ id: 1 })]);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockAuthor,
        }),
      );

      const { result } = renderHook(() => useAuthorMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.updateAuthor({ id: 1, name: '更新された著者' });
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith(
        '/api/authors/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: '更新された著者' }),
        }),
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('著者を更新しました');

      // キャッシュが無効化されることを確認
      const queryState = queryClient.getQueryState(['authors']);
      expect(queryState?.isInvalidated).toBe(true);
    });

    it('著者更新が失敗する', async () => {
      const errorMessage = '著者の更新に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useAuthorMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.updateAuthor({ id: 1, name: '更新された著者' });
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

      const { result } = renderHook(() => useAuthorMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.updateAuthor({ id: 1, name: '更新された著者' });
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

  describe('deleteAuthor', () => {
    it('著者削除が成功する', async () => {
      const queryClient = createTestQueryClient();

      // 事前にauthorsリストをキャッシュに追加
      queryClient.setQueryData(['authors'], [createMockAuthor({ id: 1 })]);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ message: '削除しました' }),
        }),
      );

      const { result } = renderHook(() => useAuthorMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.deleteAuthor(1);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/authors/1', {
        method: 'DELETE',
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('著者を削除しました');

      // キャッシュが無効化されることを確認
      const queryState = queryClient.getQueryState(['authors']);
      expect(queryState?.isInvalidated).toBe(true);
    });

    it('著者削除が失敗する', async () => {
      const errorMessage = '著者の削除に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useAuthorMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.deleteAuthor(1);
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

      const { result } = renderHook(() => useAuthorMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.deleteError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.deleteAuthor(1);
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
