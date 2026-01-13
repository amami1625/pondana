'use client';

import { useUser, useUserBooks, useUserLists } from '@/app/(protected)/users/_hooks';
import {
  UserProfileView,
  UserBooksView,
  UserListsView,
} from '@/app/(protected)/users/_components/display/view';
import QueryBoundary from '@/components/data/QueryBoundary';

interface UserDetailClientProps {
  id: string;
}

export default function UserDetailClient({ id }: UserDetailClientProps) {
  const userQuery = useUser(id);
  const booksQuery = useUserBooks(id);
  const listsQuery = useUserLists(id);

  return (
    <div className="space-y-8">
      {/* ユーザープロフィール */}
      <QueryBoundary
        {...userQuery}
        loadingMessage="ユーザー情報を読み込んでいます..."
        errorMessage="エラーが発生しました"
      >
        {(user) => <UserProfileView user={user} />}
      </QueryBoundary>

      {/* 公開している本 */}
      <QueryBoundary
        {...booksQuery}
        loadingMessage="本を読み込んでいます..."
        errorMessage="本の取得に失敗しました"
      >
        {(books) => <UserBooksView books={books} />}
      </QueryBoundary>

      {/* 公開しているリスト */}
      <QueryBoundary
        {...listsQuery}
        loadingMessage="リストを読み込んでいます..."
        errorMessage="リストの取得に失敗しました"
      >
        {(lists) => <UserListsView lists={lists} />}
      </QueryBoundary>
    </div>
  );
}
