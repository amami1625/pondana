'use client';

import Link from 'next/link';
import { BookOpen, List, Users, UserCheck } from 'lucide-react';
import { CldImage } from 'next-cloudinary';
import { UserWithStats } from '@/app/(protected)/users/_types';
import FollowButton from '@/app/(protected)/users/_components/actions/FollowButton';

interface UserProfileViewProps {
  user: UserWithStats;
}

export default function UserProfileView({ user }: UserProfileViewProps) {
  return (
    <div className="space-y-6">
      {/* ユーザープロフィールカード */}
      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <div className="flex flex-col items-center">
          {/* プロフィール画像 or 頭文字 */}
          {user.avatar_public_id ? (
            <CldImage
              src={user.avatar_public_id}
              alt={user.name}
              width={128}
              height={128}
              crop="thumb"
              gravity="custom"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-primary text-white text-5xl font-bold mb-4">
              <span data-testid="initial">{user.name.charAt(0).toUpperCase()}</span>
            </div>
          )}

          {/* ユーザー名 */}
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{user.name}</h2>

          {/* フォローボタン */}
          <div className="mb-6">
            <FollowButton userId={user.id} />
          </div>

          {/* 統計情報 */}
          <div className="flex gap-8">
            {/* フォロー中 */}
            <Link
              href={`/users/${user.id}/following`}
              className="flex flex-col items-center hover:opacity-70 transition-opacity"
            >
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-5 h-5 text-slate-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {user.stats.following_count}
                </span>
              </div>
              <span className="text-sm text-slate-600">フォロー中</span>
            </Link>

            {/* フォロワー */}
            <Link
              href={`/users/${user.id}/followers`}
              className="flex flex-col items-center hover:opacity-70 transition-opacity"
            >
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-slate-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {user.stats.followers_count}
                </span>
              </div>
              <span className="text-sm text-slate-600">フォロワー</span>
            </Link>

            {/* 公開している本 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-5 h-5 text-slate-600" />
                <span className="text-2xl font-bold text-slate-900">{user.stats.public_books}</span>
              </div>
              <span className="text-sm text-slate-600">公開している本</span>
            </div>

            {/* 公開しているリスト */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <List className="w-5 h-5 text-slate-600" />
                <span className="text-2xl font-bold text-slate-900">{user.stats.public_lists}</span>
              </div>
              <span className="text-sm text-slate-600">公開しているリスト</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
