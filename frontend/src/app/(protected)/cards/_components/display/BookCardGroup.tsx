'use client';

import { useState } from 'react';
import { Card } from '@/app/(protected)/cards/_types';
import CardItem from '@/app/(protected)/cards/_components/display/CardItem';
import CardModal from '@/app/(protected)/cards/_components/modal';
import Button from '@/components/buttons/Button';
import { StickyNote, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section className="space-y-4">
      {/* 本のタイトルと作成ボタン */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* 展開/折りたたみボタン */}
          <button
            onClick={toggleExpand}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            aria-label={isExpanded ? 'カードリストを折りたたむ' : 'カードリストを展開する'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <ChevronUp size={24} className="text-gray-600" />
            ) : (
              <ChevronDown size={24} className="text-gray-600" />
            )}
          </button>

          <h2 className="text-xl font-bold text-gray-900 truncate">{book.title}</h2>

          <span className="text-sm text-gray-500 flex-shrink-0">({cards.length}枚)</span>
        </div>

        <Button
          variant="primary"
          onClick={cardModal.open}
          icon={<StickyNote className="h-4 w-4" />}
        >
          カードを作成
        </Button>
      </div>

      {/* カードのリスト（アコーディオン） */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
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
      </div>

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
