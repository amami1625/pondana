'use client';

import { useList } from '@/app/(protected)/lists/_hooks/useList';
import QueryBoundary from '@/components/data/QueryBoundary';
import ListDetailView from '@/app/(protected)/lists/_components/display/view/ListDetailView';

interface ListDetailClientProps {
  id: string;
}

export default function ListDetailClient({ id }: ListDetailClientProps) {
  const query = useList(id);

  return (
    <QueryBoundary {...query} loadingMessage="リストを読み込んでいます...">
      {(list) => <ListDetailView list={list} />}
    </QueryBoundary>
  );
}
