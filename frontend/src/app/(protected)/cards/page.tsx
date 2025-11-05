'use client';

import PageTitle from '@/components/PageTitle';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingState from '@/components/LoadingState';
import CardListView from '@/app/(protected)/cards/_components/display/CardListView';
import { useCards } from '@/app/(protected)/cards/_hooks/useCards';

export default function CardsPage() {
  const { data: cardList, error, isLoading } = useCards();

  // ローディング状態
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

  return (
    <>
      <PageTitle title="カード一覧" />
      <CardListView cardList={cardList} />
    </>
  );
}
