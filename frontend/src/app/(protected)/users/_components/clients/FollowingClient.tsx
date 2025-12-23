'use client';

import { useUser, useFollowing } from '@/app/(protected)/users/_hooks';
import { ErrorMessage, LoadingState } from '@/components/feedback';
import FollowingView from '../display/view/FollowingView';

interface FollowingClientProps {
  id: string;
}

export default function FollowingClient({ id }: FollowingClientProps) {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: userError,
    error: userErrObj,
  } = useUser(id);
  const {
    data: following,
    isLoading: isFollowingLoading,
    isError: followingError,
    error: followingErrObj,
  } = useFollowing(id);

  // ローディング状態
  if (isUserLoading || isFollowingLoading) {
    return <LoadingState message="フォロー中のユーザーを読み込んでいます..." />;
  }

  // エラー状態
  if (userError) {
    return <ErrorMessage message={userErrObj.message} />;
  }

  if (followingError) {
    return <ErrorMessage message={followingErrObj.message} />;
  }

  // エラー状態
  if (userError || followingError) {
    return <ErrorMessage message="エラーが発生しました" />;
  }

  // prefetchされているのでデータは存在するはず
  if (!user || !following) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <FollowingView id={id} userName={user.name} following={following} />;
}
