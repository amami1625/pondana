import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider, createTestUuid } from '@/test/helpers';
import { createMockBook } from '@/test/factories';
import { useUserBooks } from './useUserBooks';
import { fetchUserBooks } from '@/app/(protected)/users/_lib/query/fetchUserBooks';

// fetchUserBooksをモック化
vi.mock('@/app/(protected)/users/_lib/query/fetchUserBooks');

describe('useUserBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBooks = [
    createMockBook({
      id: createTestUuid(1),
      title: 'テスト本1',
      public: true,
    }),
    createMockBook({
      id: createTestUuid(2),
      title: 'テスト本2',
      public: true,
    }),
  ];

  describe('成功時', () => {
    it('fetchUserBooksを呼び出してデータを取得する', async () => {
      vi.mocked(fetchUserBooks).mockResolvedValue(mockBooks);

      const { result } = renderHook(() => useUserBooks('1'), {
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
      expect(result.current.data).toEqual(mockBooks);
      expect(result.current.data).toHaveLength(2);

      // fetchUserBooksが正しい引数で呼ばれたことを確認
      expect(fetchUserBooks).toHaveBeenCalledWith('1');
      expect(fetchUserBooks).toHaveBeenCalledTimes(1);
    });

    it('idが空文字列の時、クエリを実行しない', () => {
      const { result } = renderHook(() => useUserBooks(''), {
        wrapper: createProvider(),
      });

      // クエリが無効化されているため、データ取得が行われない
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();

      // fetchUserBooksが呼ばれていないことを確認
      expect(fetchUserBooks).not.toHaveBeenCalled();
    });
  });

  describe('エラー時', () => {
    it('fetchUserBooksがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchUserBooks).mockRejectedValue(
        new Error('ユーザーの公開本一覧の取得に失敗しました'),
      );

      const { result } = renderHook(() => useUserBooks('1'), {
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
      expect(result.current.error?.message).toBe('ユーザーの公開本一覧の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('キャッシュが有効に機能する', async () => {
      vi.mocked(fetchUserBooks).mockResolvedValue(mockBooks);

      const { result, rerender } = renderHook(() => useUserBooks('1'), {
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
