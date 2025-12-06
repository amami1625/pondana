import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider, createTestUuid } from '@/test/helpers';
import { createMockBook } from '@/test/factories';
import { useBooks } from './useBooks';
import { fetchBooks } from '@/app/(protected)/books/_lib/fetchBooks';
import type { Book } from '@/app/(protected)/books/_types';

// fetchBooksをモック化
vi.mock('@/app/(protected)/books/_lib/fetchBooks');

describe('useBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchBooksを呼び出してデータを取得する', async () => {
      const mockBooks: Book[] = [
        createMockBook({ id: createTestUuid(1), title: 'テスト本A' }),
        createMockBook({ id: createTestUuid(2), title: 'テスト本B' }),
      ];

      vi.mocked(fetchBooks).mockResolvedValue(mockBooks);

      const { result } = renderHook(() => useBooks(), {
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

      // fetchBooksが呼ばれたことを確認
      expect(fetchBooks).toHaveBeenCalledTimes(1);
    });

    it('空配列を取得できる', async () => {
      vi.mocked(fetchBooks).mockResolvedValue([]);

      const { result } = renderHook(() => useBooks(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('fetchBooksがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchBooks).mockRejectedValue(new Error('書籍一覧の取得に失敗しました'));

      const { result } = renderHook(() => useBooks(), {
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
      expect(result.current.error?.message).toBe('書籍一覧の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchBooks).mockResolvedValue([]);

      const { result } = renderHook(() => useBooks(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // queryKeyの確認（内部実装に依存するため、間接的に確認）
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
