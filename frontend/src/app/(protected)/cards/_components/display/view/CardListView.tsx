import { CardList } from '@/app/(protected)/cards/_types';
import EmptyState from '@/components/feedback/EmptyState';
import BookCardGroup from '@/app/(protected)/cards/_components/display/BookCardGroup';
import PageTitle from '@/components/layout/PageTitle';

interface CardListViewProps {
  cardList: CardList;
}

export default function CardListView({ cardList }: CardListViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <PageTitle title="カード一覧" />
      {cardList.books.length === 0 ? (
        <EmptyState element="カード" context="list" />
      ) : (
        <>
          {cardList.books.map((group) => (
            <BookCardGroup key={group.book.id} book={group.book} cards={group.cards} />
          ))}
        </>
      )}
    </div>
  );
}
