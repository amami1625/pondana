import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockCard } from '@/test/factories';
import { useCard } from './useCard';
import { fetchCard } from '@/app/(protected)/cards/_lib/fetchCard';
import type { CardDetail } from '@/app/(protected)/cards/_types';

// fetchCardをモック化
vi.mock('@/app/(protected)/cards/_lib/fetchCard');

describe('useCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchCardを呼び出してデータを取得する', async () => {
      const mockCard: CardDetail = createMockCard({
        id: 1,
        title: 'テストカード',
      });

      vi.mocked(fetchCard).mockResolvedValue(mockCard);

      const { result } = renderHook(() => useCard(1), {
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
      expect(result.current.data).toEqual(mockCard);

      // fetchCardが正しい引数で呼ばれたことを確認
      expect(fetchCard).toHaveBeenCalledWith(1);
      expect(fetchCard).toHaveBeenCalledTimes(1);
    });

    it('idが0の時、クエリを実行しない', () => {
      const { result } = renderHook(() => useCard(0), {
        wrapper: createProvider(),
      });

      // クエリが無効化されているため、データ取得が行われない
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();

      // fetchCardが呼ばれていないことを確認
      expect(fetchCard).not.toHaveBeenCalled();
    });
  });

  describe('エラー時', () => {
    it('fetchCardがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchCard).mockRejectedValue(new Error('カード詳細の取得に失敗しました'));

      const { result } = renderHook(() => useCard(1), {
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
      expect(result.current.error?.message).toBe('カード詳細の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchCard).mockResolvedValue(createMockCard());

      const { result } = renderHook(() => useCard(42), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // fetchCardが正しいidで呼ばれたことを確認
      expect(fetchCard).toHaveBeenCalledWith(42);
    });
  });
});
