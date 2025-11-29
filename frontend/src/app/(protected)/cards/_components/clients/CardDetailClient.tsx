'use client';

import { useCard } from '@/app/(protected)/cards/_hooks/useCard';
import CardDetailView from '@/app/(protected)/cards/_components/display/view/CardDetailView';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import LoadingState from '@/components/feedback/LoadingState';

type Props = {
  id: number;
};

export default function CardDetailClient({ id }: Props) {
  const { data: card, error: cardError, isLoading } = useCard(id);

  if (isLoading) {
    return <LoadingState message="カード情報を読み込んでいます..." />;
  }

  if (cardError) {
    return <ErrorMessage message={cardError?.message || 'エラーが発生しました'} />;
  }

  if (!card) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <CardDetailView card={card} />;
}
