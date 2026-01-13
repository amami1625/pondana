import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockUser } from '@/test/factories';
import { useFollowing } from './useFollowing';
import { fetchFollowing } from '@/app/(protected)/users/_lib/query/fetchFollowing';

// fetchFollowingをモック化
vi.mock('@/app/(protected)/users/_lib/query/fetchFollowing');

describe('useFollowing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFollowing = [
    createMockUser({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'フォロー中1' }),
    createMockUser({ id: '550e8400-e29b-41d4-a716-446655440002', name: 'フォロー中2' }),
  ];

  describe('成功時', () => {
    it('fetchFollowingを呼び出してデータを取得する', async () => {
      vi.mocked(fetchFollowing).mockResolvedValue(mockFollowing);

      const { result } = renderHook(() => useFollowing('1'), {
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
      expect(result.current.data).toEqual(mockFollowing);

      // fetchFollowingが正しい引数で呼ばれたことを確認
      expect(fetchFollowing).toHaveBeenCalledWith('1');
      expect(fetchFollowing).toHaveBeenCalledTimes(1);
    });

    it('フォロー中が0人の場合、空配列を返す', async () => {
      vi.mocked(fetchFollowing).mockResolvedValue([]);

      const { result } = renderHook(() => useFollowing('1'), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });

    it('複数のフォロー中ユーザーを取得できる', async () => {
      const mockFollowing = [
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440001', name: 'ユーザーX' }),
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440002', name: 'ユーザーY' }),
        createMockUser({ id: '550e8400-e29b-41d4-a716-446655440003', name: 'ユーザーZ' }),
      ];

      vi.mocked(fetchFollowing).mockResolvedValue(mockFollowing);

      const { result } = renderHook(() => useFollowing('1'), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(3);
      expect(result.current.data?.[0].name).toBe('ユーザーX');
      expect(result.current.data?.[1].name).toBe('ユーザーY');
      expect(result.current.data?.[2].name).toBe('ユーザーZ');
    });

    it('idが空文字列の時、クエリを実行しない', () => {
      const { result } = renderHook(() => useFollowing(''), {
        wrapper: createProvider(),
      });

      // クエリが無効化されているため、データ取得が行われない
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();

      // fetchFollowingが呼ばれていないことを確認
      expect(fetchFollowing).not.toHaveBeenCalled();
    });
  });

  describe('エラー時', () => {
    it('fetchFollowingがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchFollowing).mockRejectedValue(new Error('ネットワークエラーが発生しました'));

      const { result } = renderHook(() => useFollowing('1'), {
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
      expect(result.current.error?.message).toBe('ネットワークエラーが発生しました');
    });
  });

  describe('React Queryの動作', () => {
    it('キャッシュが有効に機能する', async () => {
      vi.mocked(fetchFollowing).mockResolvedValue(mockFollowing);

      const { result, rerender } = renderHook(() => useFollowing('1'), {
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
