import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockStatus } from '@/test/factories/status';
import { fetchStatuses } from '@/app/(protected)/statuses/_lib/query/fetchStatuses';
import { useStatuses } from './useStatuses';

// fetchStatuses をモック化
vi.mock('@/app/(protected)/statuses/_lib/query/fetchStatuses');

describe('useStatuses', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });
  
  // APIから返ってくる想定のデータ
  const mockStatuses = [
    createMockStatus({ id: 1, name: 'テストステータスA' }),
    createMockStatus({ id: 2, name: 'テストステータスB' }),
  ];

  describe('成功時', () => {
    it('fetchStatuses を呼び出してデータを取得する', async () => {
      vi.mocked(fetchStatuses).mockResolvedValue(mockStatuses);

      // フックをレンダリング
      const { result } = renderHook(() => useStatuses(), {
        wrapper: createProvider(),
      });

      // 初期状態：ローディング中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // 成功状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockStatuses);

      // fetchStatuses が正しく呼ばれたことを確認
      expect(fetchStatuses).toHaveBeenCalledTimes(1);
    });

    it('空配列を取得できる', async () => {
      vi.mocked(fetchStatuses).mockResolvedValue([]);

      // フックをレンダリング
      const { result } = renderHook(() => useStatuses(), {
        wrapper: createProvider(),
      });

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('fetchStatuses がエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchStatuses).mockRejectedValue(new Error('ステータスの取得に失敗しました'));

      // フックをレンダリング
      const { result } = renderHook(() => useStatuses(), {
        wrapper: createProvider(),
      });

      // 初期状態：ローディング中
      expect(result.current.isLoading).toBe(true);

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('ステータスの取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('キャッシュが有効に機能する', async () => {
      vi.mocked(fetchStatuses).mockResolvedValue(mockStatuses);

      const { result, rerender } = renderHook(() => useStatuses(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isSuccess).toBe(true);

      // 再レンダリング時にキャッシュから即座にデータが返される
      rerender();
      expect(result.current.data).toBeDefined();
    });
  });
});
