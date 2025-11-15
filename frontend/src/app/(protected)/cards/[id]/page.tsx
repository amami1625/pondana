'use client';

import { useParams } from 'next/navigation';
import { useCard } from '@/app/(protected)/cards/_hooks/useCard';
import CardDetailView from '@/app/(protected)/cards/_components/display/view/CardDetailView';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';

export default function CardPage() {
  const { id } = useParams();
  const { data: card, error: cardError, isLoading: cardLoading } = useCard(Number(id));

  // ローディング状態
  if (cardLoading) {
    return <LoadingState message="カード情報を読み込んでいます..." />;
  }

  // エラー状態
  if (cardError) {
    return <ErrorMessage message={cardError?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!card) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <CardDetailView card={card} />;
}
