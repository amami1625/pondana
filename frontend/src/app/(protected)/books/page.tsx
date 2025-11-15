'use client';

import ErrorMessage from '@/components/ErrorMessage';
import LoadingState from '@/components/LoadingState';
import { useBooks } from '@/app/(protected)/books/_hooks/useBooks';
import BookIndexView from '@/app/(protected)/books/_components/display/view/BookIndexView';

export default function BooksPage() {
  const { data: books, error: bookError, isLoading: bookLoading } = useBooks();

  // ローディング状態
  if (bookLoading) {
    return <LoadingState message="本一覧を読み込んでいます..." />;
  }

  // エラー状態
  if (bookError) {
    return <ErrorMessage message={bookError?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!books) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <BookIndexView books={books} />;
}
