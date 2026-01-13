'use client';

import Link from 'next/link';
import { UserSearchResult } from '@/app/(protected)/users/_types';
import FollowButton from '@/app/(protected)/users/_components/actions/FollowButton';

interface UserSearchResultsProps {
  query: string;
  suggestions: UserSearchResult[];
  isLoading: boolean;
}

export default function UserSearchResults({
  query,
  suggestions,
  isLoading,
}: UserSearchResultsProps) {
  const trimmedQuery = query.trim();

  // 2文字以上の場合のみ結果を表示
  if (trimmedQuery.length < 2) {
    return null;
  }

  // ローディング中
  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">検索中...</div>;
  }

  // 検索結果がある場合
  if (suggestions.length > 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600 mb-4">
          {suggestions.length}件のユーザーが見つかりました
        </p>
        <div className="space-y-2">
          {suggestions.map((user) => (
            <div
              key={user.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* TODO: ユーザー画像変更機能実装後に画像を表示するように変更 */}
                <Link href={`/users/${user.id}`}>
                  <div
                    className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium cursor-pointer"
                    data-testid="initial"
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <Link href={`/users/${user.id}`} className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate hover:underline">
                    {user.name}
                  </div>
                </Link>
                <div className="flex-shrink-0">
                  <FollowButton userId={user.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 検索結果がない場合
  return (
    <div className="text-center py-8 text-gray-500">
      「{query}」に一致するユーザーが見つかりませんでした
    </div>
  );
}
