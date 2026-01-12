'use client';

import { Card } from '@/app/(protected)/cards/_types';
import CardItem from '@/app/(protected)/cards/_components/display/CardItem';
import CardModal from '@/app/(protected)/cards/_components/modal';
import Button from '@/components/buttons/Button';
import { StickyNote } from 'lucide-react';
import { useModal } from '@/hooks/useModal';

interface BookCardGroupProps {
  book: {
    id: string;
    title: string;
  };
  cards: Card[];
}

export default function BookCardGroup({ book, cards }: BookCardGroupProps) {
  const cardModal = useModal();

  return (
    <section className="space-y-4">
      {/* 本のタイトルと作成ボタン */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900 w-full sm:flex-1 min-w-0 truncate">
          {book.title}
        </h2>
        <Button
          variant="primary"
          onClick={cardModal.open}
          icon={<StickyNote className="h-4 w-4" />}
        >
          カードを作成
        </Button>
      </div>

      {/* カードのリスト */}
      {cards.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">この本にはまだカードが登録されていません</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      )}

      {/* カード作成モーダル */}
      <CardModal
        bookId={book.id}
        bookTitle={book.title}
        isOpen={cardModal.isOpen}
        onClose={cardModal.close}
      />
    </section>
  );
}
