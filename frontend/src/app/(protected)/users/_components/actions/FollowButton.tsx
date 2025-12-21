'use client';

import { UserPlus, UserMinus } from 'lucide-react';
import { useFollowMutations } from '@/app/(protected)/users/_hooks/useFollowMutations';
import { useFollowStatus } from '@/app/(protected)/users/_hooks/useFollowStatus';
import { useProfile } from '@/hooks/useProfile';

interface FollowButtonProps {
  userId: string;
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const { data: profile } = useProfile();
  const { data: followStatus, isLoading: isStatusLoading } = useFollowStatus(userId);
  const { follow, unfollow, isLoading: isMutating } = useFollowMutations(userId);

  // 自分自身のプロフィールの場合はボタンを表示しない
  if (profile?.id.toString() === userId) {
    return null;
  }

  const isFollowing = followStatus?.is_following ?? false;
  const isDisabled = isStatusLoading || isMutating;

  const handleClick = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors hover:cursor-pointer
        ${
          isFollowing
            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            : 'bg-primary text-white hover:bg-primary-dark'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" />
          フォロー中
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          フォロー
        </>
      )}
    </button>
  );
}
