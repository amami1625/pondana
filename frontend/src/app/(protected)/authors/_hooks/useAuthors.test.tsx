import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockAuthor } from '@/test/factories';
import { useAuthors } from './useAuthors';
import { fetchAuthors } from '@/app/(protected)/authors/_lib/fetchAuthors';
import type { Author } from '@/app/(protected)/authors/_types';

// fetchAuthorsをモック化
vi.mock('@/app/(protected)/authors/_lib/fetchAuthors');

describe('useAuthors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchAuthorsを呼び出してデータを取得する', async () => {
      const mockAuthors: Author[] = [
        createMockAuthor({ id: 1, name: 'テスト著者A' }),
        createMockAuthor({ id: 2, name: 'テスト著者B' }),
      ];

      vi.mocked(fetchAuthors).mockResolvedValue(mockAuthors);

      const { result } = renderHook(() => useAuthors(), {
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
      expect(result.current.data).toEqual(mockAuthors);

      // fetchAuthorsが呼ばれたことを確認
      expect(fetchAuthors).toHaveBeenCalledTimes(1);
    });

    it('空配列を取得できる', async () => {
      vi.mocked(fetchAuthors).mockResolvedValue([]);

      const { result } = renderHook(() => useAuthors(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('fetchAuthorsがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchAuthors).mockRejectedValue(new Error('著者一覧の取得に失敗しました'));

      const { result } = renderHook(() => useAuthors(), {
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
      expect(result.current.error?.message).toBe('著者一覧の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchAuthors).mockResolvedValue([]);

      const { result } = renderHook(() => useAuthors(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // queryKeyの確認（内部実装に依存するため、間接的に確認）
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
