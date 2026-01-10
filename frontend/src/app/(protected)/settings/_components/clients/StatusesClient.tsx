'use client';

import { useStatuses } from '@/app/(protected)/statuses/_hooks/useStatuses';
import QueryBoundary from '@/components/data/QueryBoundary';
import StatusesIndexView from '@/app/(protected)/settings/_components/display/view/StatusesIndexView';

export default function StatusesClient() {
  const query = useStatuses();

  return (
    <QueryBoundary {...query} loadingMessage="ステータス情報を読み込んでいます...">
      {(statuses) => <StatusesIndexView statuses={statuses} />}
    </QueryBoundary>
  );
}
