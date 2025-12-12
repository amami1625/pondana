'use client';

import { CardList } from '@/app/(protected)/cards/_types';
import EmptyState from '@/components/feedback/EmptyState';
import BookCardGroup from '@/app/(protected)/cards/_components/display/BookCardGroup';
import PageTitle from '@/components/layout/PageTitle';
import Filter from '@/components/filters/Filter';
import { useCardListView } from '@/app/(protected)/cards/_hooks/useCardListView';

interface CardListViewProps {
  cardList: CardList;
}

export default function CardListView({ cardList }: CardListViewProps) {
  const { statuses, selectedStatus, setSelectedStatus, filteredCards } = useCardListView(cardList);

  return (
    <div className="flex flex-col gap-8">
      <PageTitle title="カード一覧" />
      {cardList.books.length === 0 ? (
        <EmptyState element="カード" context="list" />
      ) : (
        <>
          {/* フィルター */}
          <Filter items={statuses} selectedItem={selectedStatus} onSelectItem={setSelectedStatus} />

          {/* カード一覧 */}
          {filteredCards.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              このステータスに該当するカードがありません
            </p>
          ) : (
            filteredCards.map((group) => (
              <BookCardGroup key={group.book.id} book={group.book} cards={group.cards} />
            ))
          )}
        </>
      )}
    </div>
  );
}
