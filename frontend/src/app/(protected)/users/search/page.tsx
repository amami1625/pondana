'use client';

import { UserSearchInput, UserSearchResults } from '@/app/(protected)/users/search/_components';
import { useUserSearchApi } from '@/app/(protected)/users/search/_hooks/useUserSearchApi';

export default function UsersPage() {
  const { query, setQuery, suggestions, isLoading } = useUserSearchApi();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ユーザー検索</h1>
        <p className="text-gray-600">ユーザー名で検索して、プロフィールを閲覧できます。</p>
      </div>

      {/* 検索入力 */}
      <UserSearchInput query={query} setQuery={setQuery} isLoading={isLoading} />

      {/* 検索結果一覧 */}
      <UserSearchResults query={query} suggestions={suggestions} isLoading={isLoading} />
    </div>
  );
}
