'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { User } from '@/app/(protected)/users/_types';
import FollowList from '@/app/(protected)/users/_components/display/FollowList';

interface FollowingViewProps {
  id: string;
  userName: string;
  following: User[];
}

export default function FollowingView({ id, userName, following }: FollowingViewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 戻るボタン */}
        <Link
          href={`/users/${id}`}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {userName}のプロフィールに戻る
        </Link>

        {/* ページタイトル */}
        <h1 className="text-3xl font-bold text-slate-900">フォロー中</h1>

        {/* フォロー中のユーザー一覧 */}
        {following.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-600">フォロー中のユーザーはいません</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-200">
            {following.map((user) => (
              <FollowList key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
