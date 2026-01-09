'use client';

import { Card } from '@/app/(protected)/cards/_types';
import Button from '@/components/buttons/Button';
import { DetailLink } from '@/components/links';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';
import StatusBadge from '@/components/badges/StatusBadge';
import { useRouter } from 'next/navigation';
import { Flag } from 'lucide-react';

interface CardItemProps {
  card: Card;
}

export default function CardItem({ card }: CardItemProps) {
  const router = useRouter();
  const { deleteCard } = useCardMutations();

  const handleDelete = () => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    if (card) {
      deleteCard(
        { bookId: card.book_id, cardId: card.id },
        {
          onSuccess: () => {
            router.push('/cards');
          },
        },
      );
    }
  };

  return (
    <div className="border-b border-gray-200 p-4 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* タイトル */}
          <h3 className="text-base font-semibold text-gray-900 mb-2 truncate">{card.title}</h3>

          {/* 本文 */}
          <p className="text-sm text-gray-600 whitespace-pre-wrap mb-2">{card.content}</p>

          {/* ステータス */}
          {card.status && (
            <div className="inline-flex items-center gap-2">
              <Flag size={16} className="text-gray-500" />
              <StatusBadge label={card.status.name} />
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex-shrink-0 flex gap-2 justify-center sm:justify-start">
          <DetailLink href={`/cards/${card.id}`} />
          <Button variant="delete" onClick={handleDelete}>
            削除
          </Button>
        </div>
      </div>
    </div>
  );
}
