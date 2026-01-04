'use client';

import { UserSearchInput, UserSearchResults } from '@/app/(protected)/users/search/_components';
import { useUserSearchApi } from '@/app/(protected)/users/search/_hooks/useUserSearchApi';
import PageTitle from '@/components/layout/PageTitle';

export default function UsersPage() {
  const { query, setQuery, suggestions, isLoading } = useUserSearchApi();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <PageTitle title="ユーザー検索" />
        <p className="text-gray-600">ユーザー名で検索して、プロフィールを閲覧できます。</p>
      </div>

      {/* 検索入力 */}
      <UserSearchInput query={query} setQuery={setQuery} isLoading={isLoading} />

      {/* 検索結果一覧 */}
      <UserSearchResults query={query} suggestions={suggestions} isLoading={isLoading} />
    </div>
  );
}
