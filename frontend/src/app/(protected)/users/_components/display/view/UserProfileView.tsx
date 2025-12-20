'use client';

import Image from 'next/image';
import { BookOpen, List } from 'lucide-react';
import { UserWithStats } from '@/app/(protected)/users/_types';

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
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
          ) : (
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-primary text-white text-5xl font-bold mb-4">
              <span data-testid="initial">{user.name.charAt(0).toUpperCase()}</span>
            </div>
          )}

          {/* ユーザー名 */}
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{user.name}</h2>

          {/* 統計情報 */}
          <div className="flex gap-8">
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
