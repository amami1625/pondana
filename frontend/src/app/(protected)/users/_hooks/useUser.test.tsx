import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockUserWithStats } from '@/test/factories';
import { useUser } from './useUser';
import { fetchUser } from '@/app/(protected)/users/_lib/query/fetchUser';

// fetchUserをモック化
vi.mock('@/app/(protected)/users/_lib/query/fetchUser');

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUser = createMockUserWithStats({
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'テストユーザー',
    stats: {
      public_books: 10,
      public_lists: 5,
      following_count: 3,
      followers_count: 7,
    },
  });

  describe('成功時', () => {
    it('fetchUserを呼び出してデータを取得する', async () => {
      vi.mocked(fetchUser).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useUser('1'), {
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
      expect(result.current.data).toEqual(mockUser);

      // fetchUserが正しい引数で呼ばれたことを確認
      expect(fetchUser).toHaveBeenCalledWith('1');
      expect(fetchUser).toHaveBeenCalledTimes(1);
    });

    it('idが空文字列の時、クエリを実行しない', () => {
      const { result } = renderHook(() => useUser(''), {
        wrapper: createProvider(),
      });

      // クエリが無効化されているため、データ取得が行われない
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();

      // fetchUserが呼ばれていないことを確認
      expect(fetchUser).not.toHaveBeenCalled();
    });
  });

  describe('エラー時', () => {
    it('fetchUserがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchUser).mockRejectedValue(new Error('ユーザー情報の取得に失敗しました'));

      const { result } = renderHook(() => useUser('1'), {
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
      expect(result.current.error?.message).toBe('ユーザー情報の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('キャッシュが有効に機能する', async () => {
      vi.mocked(fetchUser).mockResolvedValue(mockUser);

      const { result, rerender } = renderHook(() => useUser('1'), {
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
