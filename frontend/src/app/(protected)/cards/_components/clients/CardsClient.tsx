'use client';

import { useCards } from '@/app/(protected)/cards/_hooks/useCards';
import CardListView from '@/app/(protected)/cards/_components/display/view/CardListView';
import QueryBoundary from '@/components/data/QueryBoundary';

export default function CardsClient() {
  const query = useCards();

  return (
    <QueryBoundary {...query} loadingMessage="カード一覧を読み込んでいます...">
      {(cardList) => <CardListView cardList={cardList} />}
    </QueryBoundary>
  );
}
