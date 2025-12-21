import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';

interface FollowResponse {
  message: string;
}

interface FollowError {
  error: string | string[];
}

async function followUser(userId: string): Promise<FollowResponse> {
  const response = await fetch(`/api/users/${userId}/follow`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error: FollowError = await response.json();
    throw new Error(Array.isArray(error.error) ? error.error.join(', ') : error.error);
  }

  return response.json();
}

async function unfollowUser(userId: string): Promise<FollowResponse> {
  const response = await fetch(`/api/users/${userId}/follow`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error: FollowError = await response.json();
    throw new Error(Array.isArray(error.error) ? error.error.join(', ') : error.error);
  }

  return response.json();
}

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
