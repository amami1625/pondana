'use client';

import { useCards } from '@/app/(protected)/cards/_hooks/useCards';
import CardListView from '@/app/(protected)/cards/_components/display/view/CardListView';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import LoadingState from '@/components/feedback/LoadingState';

export default function CardsClient() {
  const { data: cardList, error, isLoading } = useCards();

  // ローディング状態（prefetchされているので通常は一瞬）
  if (isLoading) {
    return <LoadingState message="カード一覧を読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!cardList) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <CardListView cardList={cardList} />;
}
