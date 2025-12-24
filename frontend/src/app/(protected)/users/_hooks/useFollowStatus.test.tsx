import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { useFollowStatus } from './useFollowStatus';
import { fetchFollowStatus } from '@/app/(protected)/users/_lib/query/fetchFollowStatus';

// fetchFollowStatusをモック化
vi.mock('@/app/(protected)/users/_lib/query/fetchFollowStatus');

describe('useFollowStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchFollowStatusを呼び出してデータを取得する', async () => {
      const mockFollowStatus = {
        is_following: true,
        is_followed_by: false,
      };

      vi.mocked(fetchFollowStatus).mockResolvedValue(mockFollowStatus);

      const { result } = renderHook(() => useFollowStatus('1'), {
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
      expect(result.current.data).toEqual(mockFollowStatus);

      // fetchFollowStatusが正しい引数で呼ばれたことを確認
      expect(fetchFollowStatus).toHaveBeenCalledWith('1');
      expect(fetchFollowStatus).toHaveBeenCalledTimes(1);
    });

    it('両方フォローしていない状態を取得できる', async () => {
      const mockFollowStatus = {
        is_following: false,
        is_followed_by: false,
      };

      vi.mocked(fetchFollowStatus).mockResolvedValue(mockFollowStatus);

      const { result } = renderHook(() => useFollowStatus('2'), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual({
        is_following: false,
        is_followed_by: false,
      });
    });

    it('相互フォロー状態を取得できる', async () => {
      const mockFollowStatus = {
        is_following: true,
        is_followed_by: true,
      };

      vi.mocked(fetchFollowStatus).mockResolvedValue(mockFollowStatus);

      const { result } = renderHook(() => useFollowStatus('3'), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual({
        is_following: true,
        is_followed_by: true,
      });
    });

    it('idが空文字列の時、クエリを実行しない', () => {
      const { result } = renderHook(() => useFollowStatus(''), {
        wrapper: createProvider(),
      });

      // クエリが無効化されているため、データ取得が行われない
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();

      // fetchFollowStatusが呼ばれていないことを確認
      expect(fetchFollowStatus).not.toHaveBeenCalled();
    });
  });

  describe('エラー時', () => {
    it('fetchFollowStatusがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchFollowStatus).mockRejectedValue(new Error('ネットワークエラーが発生しました'));

      const { result } = renderHook(() => useFollowStatus('1'), {
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
      vi.mocked(fetchFollowStatus).mockResolvedValue({
        is_following: false,
        is_followed_by: true,
      });

      const { result } = renderHook(() => useFollowStatus('42'), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // fetchFollowStatusが正しいidで呼ばれたことを確認
      expect(fetchFollowStatus).toHaveBeenCalledWith('42');
    });
  });
});
