'use client';

import { useStatuses } from '@/app/(protected)/statuses/_hooks/useStatuses';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import LoadingState from '@/components/feedback/LoadingState';
import StatusesIndexView from '@/app/(protected)/settings/_components/display/view/StatusesIndexView';

export default function StatusesClient() {
  const { data: statuses, isLoading, error } = useStatuses();

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="ステータス情報を読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // データが取得できていない場合
  if (!statuses) {
    return <ErrorMessage message="ステータス情報の取得に失敗しました" />;
  }

  return <StatusesIndexView statuses={statuses} />;
}
