import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider, createTestUuid } from '@/test/helpers';
import { createMockBook, createMockCard, createMockList } from '@/test/factories';
import { fetchBook } from '@/app/(protected)/books/_lib/query/fetchBook';
import { BookDetail } from '@/app/(protected)/books/_types';
import { useBook } from './useBook';

// fetchBookをモック化
vi.mock('@/app/(protected)/books/_lib/query/fetchBook');

describe('useBook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBook: BookDetail = createMockBook({
    id: createTestUuid(1),
    title: 'テスト本',
    lists: [createMockList()],
    cards: [createMockCard()],
  });

  describe('成功時', () => {
    it('fetchBookを呼び出してデータを取得する', async () => {
      vi.mocked(fetchBook).mockResolvedValue(mockBook);

      const { result } = renderHook(() => useBook('1'), {
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
      expect(result.current.data).toEqual(mockBook);

      // fetchBookが正しい引数で呼ばれたことを確認
      expect(fetchBook).toHaveBeenCalledWith('1');
      expect(fetchBook).toHaveBeenCalledTimes(1);
    });

    it('idが空文字列の時、クエリを実行しない', () => {
      const { result } = renderHook(() => useBook(''), {
        wrapper: createProvider(),
      });

      // クエリが無効化されているため、データ取得が行われない
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();

      // fetchBookが呼ばれていないことを確認
      expect(fetchBook).not.toHaveBeenCalled();
    });
  });

  describe('エラー時', () => {
    it('fetchBookがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchBook).mockRejectedValue(new Error('書籍詳細の取得に失敗しました'));

      const { result } = renderHook(() => useBook('1'), {
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
      expect(result.current.error?.message).toBe('書籍詳細の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('キャッシュが有効に機能する', async () => {
      vi.mocked(fetchBook).mockResolvedValue(mockBook);

      const { result, rerender } = renderHook(() => useBook('1'), {
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
