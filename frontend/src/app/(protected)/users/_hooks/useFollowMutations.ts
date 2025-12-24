import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { followUser } from '@/app/(protected)/users/_lib/mutation/followUser';
import { unfollowUser } from '@/app/(protected)/users/_lib/mutation/unfollowUser';
import toast from 'react-hot-toast';

export function useFollowMutations(userId: string) {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => {
      toast.success('フォローしました');
      // フォロー状態のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.users.followStatus(userId) });
      // ユーザー情報のキャッシュを無効化（統計情報更新のため）
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
    },
    onError: (error) => toast.error(error.message),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId),
    onSuccess: () => {
      toast.success('フォローを解除しました');
      // フォロー状態のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.users.followStatus(userId) });
      // ユーザー情報のキャッシュを無効化（統計情報更新のため）
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowing: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
  };
}
