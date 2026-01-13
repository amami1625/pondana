'use client';

import { useUser, useFollowers } from '@/app/(protected)/users/_hooks';
import QueryBoundary from '@/components/data/QueryBoundary';
import FollowersView from '../display/view/FollowersView';

interface FollowersClientProps {
  id: string;
}

export default function FollowersClient({ id }: FollowersClientProps) {
  // TODO カスタムフック化を検討する
  const userQuery = useUser(id);
  const followersQuery = useFollowers(id);

  // 両方のデータが必要なので、どちらかがローディング中ならローディング表示
  const isLoading = userQuery.isLoading || followersQuery.isLoading;
  const error = userQuery.error || followersQuery.error;
  const data =
    userQuery.data && followersQuery.data
      ? { user: userQuery.data, followers: followersQuery.data }
      : undefined;

  return (
    <QueryBoundary
      data={data}
      isLoading={isLoading}
      error={error}
      loadingMessage="フォロワーを読み込んでいます..."
    >
      {({ user, followers }) => (
        <FollowersView id={id} userName={user.name} followers={followers} />
      )}
    </QueryBoundary>
  );
}
