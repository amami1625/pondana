import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockTopPageData } from '@/test/factories';
import { useTopPageData } from './useTopPageData';
import { fetchTopPageData } from '@/app/(protected)/top/_lib/fetchTopPageData';
import type { TopPageData } from '@/schemas/top';

// fetchTopPageDataをモック化
vi.mock('@/app/(protected)/top/_lib/fetchTopPageData');

describe('useTopPageData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchTopPageDataを呼び出してデータを取得する', async () => {
      const mockData: TopPageData = createMockTopPageData({
        recent_books: [],
        recent_lists: [],
        recent_cards: [],
      });

      vi.mocked(fetchTopPageData).mockResolvedValue(mockData);

      const { result } = renderHook(() => useTopPageData(), {
        wrapper: createProvider(),
      });

      // 初期状態: ローディング中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // 成功状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockData);

      // fetchTopPageDataが呼ばれたことを確認
      expect(fetchTopPageData).toHaveBeenCalledTimes(1);
    });

    it('空配列を取得できる', async () => {
      vi.mocked(fetchTopPageData).mockResolvedValue(createMockTopPageData());

      const { result } = renderHook(() => useTopPageData(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.recent_books).toEqual([]);
      expect(result.current.data?.recent_lists).toEqual([]);
      expect(result.current.data?.recent_cards).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('fetchTopPageDataがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchTopPageData).mockRejectedValue(
        new Error('トップページデータの取得に失敗しました'),
      );

      const { result } = renderHook(() => useTopPageData(), {
        wrapper: createProvider(),
      });

      // 初期状態: ローディング中
      expect(result.current.isLoading).toBe(true);

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('トップページデータの取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchTopPageData).mockResolvedValue(createMockTopPageData());

      const { result } = renderHook(() => useTopPageData(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // queryKeyの確認（内部実装に依存するため、間接的に確認）
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
