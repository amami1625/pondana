import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createProvider, createTestQueryClient } from '@/test/helpers';
import { useFollowMutations } from './useFollowMutations';
import { followUser } from '@/app/(protected)/users/_lib/mutation/followUser';
import { unfollowUser } from '@/app/(protected)/users/_lib/mutation/unfollowUser';
import toast from 'react-hot-toast';
import { createMockUserWithStats } from '@/test/factories';

// mutation関数をモック化
vi.mock('@/app/(protected)/users/_lib/mutation/followUser');
vi.mock('@/app/(protected)/users/_lib/mutation/unfollowUser');

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useFollowMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('follow', () => {
    it('フォローリクエストが成功する', async () => {
      let resolveFollow: (value: { message: string }) => void;
      const followPromise = new Promise<{ message: string }>((resolve) => {
        resolveFollow = resolve;
      });
      vi.mocked(followUser).mockReturnValue(followPromise);

      const queryClient = createTestQueryClient();

      // 事前にキャッシュを設定
      queryClient.setQueryData(['users', 'followStatus', '1'], { is_following: false });
      queryClient.setQueryData(
        ['users', 'detail', '1'],
        createMockUserWithStats({ id: '550e8400-e29b-41d4-a716-446655440000' }),
      );

      const { result } = renderHook(() => useFollowMutations('1'), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isFollowing).toBe(false);
      expect(result.current.isLoading).toBe(false);

      // フォロー実行
      act(() => {
        result.current.follow();
      });

      // ローディング確認
      await waitFor(() => expect(result.current.isLoading).toBe(true));

      resolveFollow!({ message: 'フォローしました' });

      // 完了を待つ
      await waitFor(() => expect(result.current.isFollowing).toBe(false));

      // followUserが正しく呼ばれたことを確認
      expect(followUser).toHaveBeenCalledWith('1');
      expect(followUser).toHaveBeenCalledTimes(1);

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('フォローしました');

      // キャッシュが無効化されることを確認
      const followStatusQueryState = queryClient.getQueryState(['users', 'followStatus', '1']);
      const userDetailQueryState = queryClient.getQueryState(['users', 'detail', '1']);
      expect(followStatusQueryState?.isInvalidated).toBe(true);
      expect(userDetailQueryState?.isInvalidated).toBe(true);
    });

    it('フォローリクエストが失敗する', async () => {
      const errorMessage = 'Cannot follow yourself';
      vi.mocked(followUser).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useFollowMutations('1'), {
        wrapper: createProvider(),
      });

      // フォロー実行
      act(() => {
        result.current.follow();
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.isFollowing).toBe(false));

      // followUserが呼ばれたことを確認
      expect(followUser).toHaveBeenCalledWith('1');

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('unfollow', () => {
    it('アンフォローリクエストが成功する', async () => {
      let unfollowResolve: (value: { message: string }) => void;
      const unfollowPromise = new Promise<{ message: string }>((resolve) => {
        unfollowResolve = resolve;
      });
      vi.mocked(unfollowUser).mockReturnValue(unfollowPromise);

      const queryClient = createTestQueryClient();

      // 事前にキャッシュを設定
      queryClient.setQueryData(['users', 'followStatus', '1'], { is_following: true });
      queryClient.setQueryData(
        ['users', 'detail', '1'],
        createMockUserWithStats({ id: '550e8400-e29b-41d4-a716-446655440000' }),
      );

      const { result } = renderHook(() => useFollowMutations('1'), {
        wrapper: createProvider(queryClient),
      });

      // 初期状態
      expect(result.current.isUnfollowing).toBe(false);
      expect(result.current.isLoading).toBe(false);

      // アンフォロー実行
      act(() => {
        result.current.unfollow();
      });

      // ローディング確認
      await waitFor(() => expect(result.current.isLoading).toBe(true));

      unfollowResolve!({ message: 'フォローを解除しました' });

      // 完了を待つ
      await waitFor(() => expect(result.current.isUnfollowing).toBe(false));

      // unfollowUserが正しく呼ばれたことを確認
      expect(unfollowUser).toHaveBeenCalledWith('1');
      expect(unfollowUser).toHaveBeenCalledTimes(1);

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('フォローを解除しました');

      // キャッシュが無効化されることを確認
      const followStatusQueryState = queryClient.getQueryState(['users', 'followStatus', '1']);
      const userDetailQueryState = queryClient.getQueryState(['users', 'detail', '1']);
      expect(followStatusQueryState?.isInvalidated).toBe(true);
      expect(userDetailQueryState?.isInvalidated).toBe(true);
    });

    it('アンフォローリクエストが失敗する', async () => {
      const errorMessage = 'Not following this user';
      vi.mocked(unfollowUser).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useFollowMutations('1'), {
        wrapper: createProvider(),
      });

      // アンフォロー実行
      act(() => {
        result.current.unfollow();
      });

      // エラーを待つ
      await waitFor(() => expect(result.current.isUnfollowing).toBe(false));

      // unfollowUserが呼ばれたことを確認
      expect(unfollowUser).toHaveBeenCalledWith('1');

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
