'use client';

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
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-3">
        {/* ヘッダー: タイトルとステータス */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-900 truncate min-w-0">{card.title}</h3>
          {card.status && (
            <div className="flex-shrink-0">
              <StatusBadge label={card.status.name} />
            </div>
          )}
        </div>

        {/* 本文 */}
        <p className="text-sm text-gray-600 line-clamp-2">{card.content}</p>

        {/* アクションボタン */}
        <div className="flex items-center gap-2 pt-1">
          <DetailLink href={`/cards/${card.id}`} />
          <Button variant="danger" onClick={handleDelete}>
            削除
          </Button>
        </div>
      </div>
    </div>
  );
}
