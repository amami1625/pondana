import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient } from '@/test/helpers';
import { createMockStatus } from '@/test/factories/status';
import { useStatusMutations } from './useStatusMutations';
import toast from 'react-hot-toast';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useStatusMutations', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('createStatus', () => {
    it('ステータスの作成が成功する', async () => {
      const mockStatus = createMockStatus({ name: 'テストステータス' });
      const queryClient = createTestQueryClient();

      // 事前に statuses のデータをキャッシュに追加
      queryClient.setQueryData(['statuses'], [createMockStatus({ id: 1 })]);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockStatus,
        }),
      );

      const { result } = renderHook(() => useStatusMutations(), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.createStatus({
          name: 'テストステータス',
        });
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isCreating).toBe(false));

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith(
        '/api/statuses',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'テストステータス',
          }),
        }),
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('ステータスを作成しました');

      // キャッシュが無効化されることを確認
      const statusesQueryState = queryClient.getQueryState(['statuses']);
      expect(statusesQueryState?.isInvalidated).toBe(true);
    });

    it('ステータスの作成が失敗する', async () => {
      const errorMessage = 'ステータスの作成に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: errorMessage }),
        }),
      );

      const { result } = renderHook(() => useStatusMutations(), {
        wrapper: createProvider(),
      });

      // 初期状態
      expect(result.current.isCreating).toBe(false);
      expect(result.current.createError).toBeNull();

      // ミューテーション実行
      act(() => {
        result.current.createStatus({
          name: 'テストステータス',
        });
      });

      // エラー完了を待つ
      await waitFor(() => expect(result.current.createError).not.toBeNull());

      // トーストでエラーが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('updateStatus', () => {
    it('ステータスの更新が成功する', async () => {
      const mockStatus = createMockStatus({ id: 1, name: '更新後ステータス' });
      const queryClient = createTestQueryClient();

      queryClient.setQueryData(['statuses'], [createMockStatus({ id: 1 })]);
      queryClient.setQueryData(['cards'], []);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockStatus,
        }),
      );

      const { result } = renderHook(() => useStatusMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.updateStatus({
          id: 1,
          name: '更新後ステータス',
        });
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith(
        '/api/statuses/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: '更新後ステータス',
          }),
        }),
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('ステータスを更新しました');

      // キャッシュが無効化されることを確認
      const statusesQueryState = queryClient.getQueryState(['statuses']);
      const cardsQueryState = queryClient.getQueryState(['cards']);
      expect(statusesQueryState?.isInvalidated).toBe(true);
      expect(cardsQueryState?.isInvalidated).toBe(true);
    });
  });

  describe('deleteStatus', () => {
    it('ステータスの削除が成功する', async () => {
      const queryClient = createTestQueryClient();

      queryClient.setQueryData(['statuses'], [createMockStatus({ id: 1 })]);
      queryClient.setQueryData(['cards'], []);

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({}),
        }),
      );

      const { result } = renderHook(() => useStatusMutations(), {
        wrapper: createProvider(queryClient),
      });

      // ミューテーション実行
      act(() => {
        result.current.deleteStatus(1);
      });

      // 完了を待つ
      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith(
        '/api/statuses/1',
        expect.objectContaining({
          method: 'DELETE',
        }),
      );

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('ステータスを削除しました');

      // キャッシュが無効化されることを確認
      const statusesQueryState = queryClient.getQueryState(['statuses']);
      const cardsQueryState = queryClient.getQueryState(['cards']);
      expect(statusesQueryState?.isInvalidated).toBe(true);
      expect(cardsQueryState?.isInvalidated).toBe(true);
    });
  });
});
