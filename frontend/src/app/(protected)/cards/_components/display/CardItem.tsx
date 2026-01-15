'use client';

import { Flag } from 'lucide-react';
import { Card } from '@/app/(protected)/cards/_types';
import Button from '@/components/buttons/Button';
import StatusBadge from '@/components/badges/StatusBadge';
import { DetailLink } from '@/components/links';
import { useCardItem } from '@/app/(protected)/cards/_hooks/useCardItem';

interface CardItemProps {
  card: Card;
}

export default function CardItem({ card }: CardItemProps) {
  const { handleDelete } = useCardItem(card);

  return (
    <div className="border-b border-gray-200 p-4 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <div className="flex-shrink-0 flex gap-2 justify-center sm:justify-start items-center">
          <DetailLink href={`/cards/${card.id}`} />
          <Button variant="danger" onClick={handleDelete}>
            削除
          </Button>
        </div>
      </div>
    </div>
  );
}
