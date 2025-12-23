'use client';

import { useUser, useFollowers } from '@/app/(protected)/users/_hooks';
import { ErrorMessage, LoadingState } from '@/components/feedback';
import FollowersView from '../display/view/FollowersView';

interface FollowersClientProps {
  id: string;
}

export default function FollowersClient({ id }: FollowersClientProps) {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: userError,
    error: userErrObj,
  } = useUser(id);
  const {
    data: followers,
    isLoading: isFollowersLoading,
    isError: followersError,
    error: followersErrObj,
  } = useFollowers(id);

  // ローディング状態
  if (isUserLoading || isFollowersLoading) {
    return <LoadingState message="フォロワーを読み込んでいます..." />;
  }

  // エラー状態
  if (userError) {
    return <ErrorMessage message={userErrObj.message} />;
  }

  if (followersError) {
    return <ErrorMessage message={followersErrObj.message} />;
  }

  // prefetchされているのでデータは存在するはず
  if (!user || !followers) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <FollowersView id={id} userName={user?.name} followers={followers} />;
}
