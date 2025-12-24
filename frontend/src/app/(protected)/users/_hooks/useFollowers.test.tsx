import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockUser } from '@/test/factories';
import { useFollowers } from './useFollowers';
import { fetchFollowers } from '@/app/(protected)/users/_lib/query/fetchFollowers';

// fetchFollowersをモック化
vi.mock('@/app/(protected)/users/_lib/query/fetchFollowers');

describe('useFollowers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchFollowersを呼び出してデータを取得する', async () => {
      const mockFollowers = [
        createMockUser({ id: 2, name: 'フォロワー1' }),
        createMockUser({ id: 3, name: 'フォロワー2' }),
      ];

      vi.mocked(fetchFollowers).mockResolvedValue(mockFollowers);

      const { result } = renderHook(() => useFollowers('1'), {
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
      expect(result.current.data).toEqual(mockFollowers);

      // fetchFollowersが正しい引数で呼ばれたことを確認
      expect(fetchFollowers).toHaveBeenCalledWith('1');
      expect(fetchFollowers).toHaveBeenCalledTimes(1);
    });

    it('フォロワーが0人の場合、空配列を返す', async () => {
      vi.mocked(fetchFollowers).mockResolvedValue([]);

      const { result } = renderHook(() => useFollowers('1'), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });

    it('複数のフォロワーを取得できる', async () => {
      const mockFollowers = [
        createMockUser({ id: 2, name: 'ユーザーA' }),
        createMockUser({ id: 3, name: 'ユーザーB' }),
        createMockUser({ id: 4, name: 'ユーザーC' }),
      ];

      vi.mocked(fetchFollowers).mockResolvedValue(mockFollowers);

      const { result } = renderHook(() => useFollowers('1'), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(3);
      expect(result.current.data?.[0].name).toBe('ユーザーA');
      expect(result.current.data?.[1].name).toBe('ユーザーB');
      expect(result.current.data?.[2].name).toBe('ユーザーC');
    });

    it('idが空文字列の時、クエリを実行しない', () => {
      const { result } = renderHook(() => useFollowers(''), {
        wrapper: createProvider(),
      });

      // クエリが無効化されているため、データ取得が行われない
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();

      // fetchFollowersが呼ばれていないことを確認
      expect(fetchFollowers).not.toHaveBeenCalled();
    });
  });

  describe('エラー時', () => {
    it('fetchFollowersがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchFollowers).mockRejectedValue(new Error('ネットワークエラーが発生しました'));

      const { result } = renderHook(() => useFollowers('1'), {
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
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchFollowers).mockResolvedValue([createMockUser()]);

      const { result } = renderHook(() => useFollowers('42'), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // fetchFollowersが正しいidで呼ばれたことを確認
      expect(fetchFollowers).toHaveBeenCalledWith('42');
    });
  });
});
