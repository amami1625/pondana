'use client';

import { useDashboard } from '@/app/(protected)/dashboard/_hooks/useDashboard';
import { ErrorMessage, LoadingState } from '@/components/feedback';
import DashboardIndexView from '@/app/(protected)/dashboard/_components/view/DashboardIndexView';

export default function DashboardClient() {
  const { data: dashboard, error, isLoading } = useDashboard();

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="ダッシュボードを読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error?.message} />;
  }

  // prefetchされているのでデータは存在するはず
  if (!dashboard) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <DashboardIndexView dashboard={dashboard} />;
}
