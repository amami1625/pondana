import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { followUser } from '@/app/(protected)/users/_lib/mutation/followUser';
import { unfollowUser } from '@/app/(protected)/users/_lib/mutation/unfollowUser';

export function useFollowMutations(userId: string) {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => {
      // フォロー状態のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.users.followStatus(userId) });
      // ユーザー情報のキャッシュを無効化（統計情報更新のため）
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId),
    onSuccess: () => {
      // フォロー状態のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.users.followStatus(userId) });
      // ユーザー情報のキャッシュを無効化（統計情報更新のため）
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
    },
  });

  return {
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowing: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
  };
}
