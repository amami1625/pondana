'use client';

import { useTopPageData } from '@/app/(protected)/top/_hooks/useTopPageData';
import TopView from '@/app/(protected)/top/_components/view/TopView';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';

export default function TopClient() {
  const { data, error, isLoading } = useTopPageData();

  // ローディング状態（prefetchされているので通常は一瞬）
  if (isLoading) {
    return <LoadingState message="データを読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!data) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  const { recent_books, recent_lists, recent_cards } = data;

  return <TopView books={recent_books} lists={recent_lists} cards={recent_cards} />;
}
