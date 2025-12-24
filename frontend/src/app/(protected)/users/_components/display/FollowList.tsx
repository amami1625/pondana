'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/app/(protected)/users/_types';

interface FollowListProps {
  user: User;
}

export default function FollowList({ user }: FollowListProps) {
  return (
    <Link
      key={user.id}
      href={`/users/${user.id}`}
      className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
    >
      {/* プロフィール画像 or 頭文字 */}
      {user.avatar_url ? (
        <Image
          src={user.avatar_url}
          alt={user.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold">
          <span>{user.name.charAt(0).toUpperCase()}</span>
        </div>
      )}

      {/* ユーザー名 */}
      <div className="flex-1">
        <h3 className="text-lg font-medium text-slate-900">{user.name}</h3>
      </div>
    </Link>
  );
}
