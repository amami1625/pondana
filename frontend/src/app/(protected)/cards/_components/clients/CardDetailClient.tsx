'use client';

import { useCard } from '@/app/(protected)/cards/_hooks/useCard';
import QueryBoundary from '@/components/data/QueryBoundary';
import CardDetailView from '@/app/(protected)/cards/_components/display/view/CardDetailView';

interface CardDetailClientProps {
  id: string;
}

export default function CardDetailClient({ id }: CardDetailClientProps) {
  const query = useCard(id);

  return (
    <QueryBoundary {...query} loadingMessage="カード情報を読み込んでいます...">
      {(card) => <CardDetailView card={card} />}
    </QueryBoundary>
  );
}
