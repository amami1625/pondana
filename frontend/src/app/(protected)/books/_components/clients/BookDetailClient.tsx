'use client';

import { useBook } from '@/app/(protected)/books/_hooks/useBook';
import BookDetailView from '@/app/(protected)/books/_components/display/view/BookDetailView';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import LoadingState from '@/components/feedback/LoadingState';

type Props = {
  id: string;
};

export default function BookDetailClient({ id }: Props) {
  const { data: book, error: bookError, isLoading } = useBook(id);

  if (isLoading) {
    return <LoadingState message="本情報を読み込んでいます..." />;
  }

  if (bookError) {
    return <ErrorMessage message={bookError?.message || 'エラーが発生しました'} />;
  }

  if (!book) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <BookDetailView book={book} />;
}
