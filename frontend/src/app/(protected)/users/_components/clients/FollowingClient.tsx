'use client';

import { useUser, useFollowing } from '@/app/(protected)/users/_hooks';
import QueryBoundary from '@/components/data/QueryBoundary';
import FollowingView from '../display/view/FollowingView';

interface FollowingClientProps {
  id: string;
}

export default function FollowingClient({ id }: FollowingClientProps) {
  // カスタムフック化を検討する
  const userQuery = useUser(id);
  const followingQuery = useFollowing(id);

  // 両方のデータが必要なので、どちらかがローディング中ならローディング表示
  const isLoading = userQuery.isLoading || followingQuery.isLoading;
  const error = userQuery.error || followingQuery.error;
  const data =
    userQuery.data && followingQuery.data
      ? { user: userQuery.data, following: followingQuery.data }
      : undefined;

  return (
    <QueryBoundary
      data={data}
      isLoading={isLoading}
      error={error}
      loadingMessage="フォロー中のユーザーを読み込んでいます..."
    >
      {({ user, following }) => (
        <FollowingView id={id} userName={user.name} following={following} />
      )}
    </QueryBoundary>
  );
}
