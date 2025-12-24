'use client';

import { useUser, useUserBooks, useUserLists } from '@/app/(protected)/users/_hooks';
import {
  UserProfileView,
  UserBooksView,
  UserListsView,
} from '@/app/(protected)/users/_components/display/view';
import { ErrorMessage, LoadingState } from '@/components/feedback';

interface UserDetailClientProps {
  id: string;
}

export default function UserDetailClient({ id }: UserDetailClientProps) {
  const { data: user, error: userError, isLoading: isUserLoading } = useUser(id);
  const { data: books, error: booksError, isLoading: isBooksLoading } = useUserBooks(id);
  const { data: lists, error: listsError, isLoading: isListsLoading } = useUserLists(id);

  return (
    <div className="space-y-8">
      {/* ユーザープロフィール */}
      <div>
        {isUserLoading ? (
          <LoadingState message="ユーザー情報を読み込んでいます..." />
        ) : userError ? (
          <ErrorMessage message={userError?.message || 'エラーが発生しました'} />
        ) : user ? (
          <UserProfileView user={user} />
        ) : null}
      </div>

      {/* 公開している本 */}
      <div>
        {isBooksLoading ? (
          <LoadingState message="本を読み込んでいます..." />
        ) : booksError ? (
          <ErrorMessage message={booksError?.message || '本の取得に失敗しました'} />
        ) : books ? (
          <UserBooksView books={books} />
        ) : null}
      </div>

      {/* 公開しているリスト */}
      <div>
        {isListsLoading ? (
          <LoadingState message="リストを読み込んでいます..." />
        ) : listsError ? (
          <ErrorMessage message={listsError?.message || 'リストの取得に失敗しました'} />
        ) : lists ? (
          <UserListsView lists={lists} />
        ) : null}
      </div>
    </div>
  );
}
