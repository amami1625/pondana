'use client';

import { useBooks } from '@/app/(protected)/books/_hooks/useBooks';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import BookIndexView from '@/app/(protected)/books/_components/display/view/BookIndexView';
import LoadingState from '@/components/feedback/LoadingState';

export default function BooksClient() {
  const { data: books, error: bookError, isLoading } = useBooks();

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="本一覧を読み込んでいます..." />;
  }

  // エラー状態
  if (bookError) {
    return <ErrorMessage message={bookError?.message} />;
  }

  // prefetchされているのでデータは存在するはず
  if (!books) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <BookIndexView books={books} />;
}
