'use client';

import { useDashboard } from '@/app/(protected)/dashboard/_hooks/useDashboard';
import QueryBoundary from '@/components/data/QueryBoundary';
import DashboardIndexView from '@/app/(protected)/dashboard/_components/display/view/DashboardIndexView';

export default function DashboardClient() {
  const query = useDashboard();

  return (
    <QueryBoundary {...query} loadingMessage="ダッシュボードを読み込んでいます...">
      {(dashboard) => <DashboardIndexView dashboard={dashboard} />}
    </QueryBoundary>
  );
}
