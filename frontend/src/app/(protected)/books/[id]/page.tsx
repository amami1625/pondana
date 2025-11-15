'use client';

import BookDetailView from '@/app/(protected)/books/_components/display/view/BookDetailView';
import { useParams } from 'next/navigation';
import { useBook } from '@/app/(protected)/books/_hooks/useBook';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';

export default function BookPage() {
  const { id } = useParams();
  const { data: book, error: bookError, isLoading: bookLoading } = useBook(Number(id));

  // ローディング状態
  if (bookLoading) {
    return <LoadingState message="本情報を読み込んでいます..." />;
  }

  // エラー状態
  if (bookError) {
    return <ErrorMessage message={bookError?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!book) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <BookDetailView book={book} />;
}
