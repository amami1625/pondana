'use client';

import { useLists } from '@/app/(protected)/lists/_hooks/useLists';
import QueryBoundary from '@/components/data/QueryBoundary';
import ListIndexView from '@/app/(protected)/lists/_components/display/view/ListIndexView';

export default function ListsClient() {
  const query = useLists();

  return (
    <QueryBoundary {...query} loadingMessage="リスト一覧を読み込んでいます...">
      {(lists) => <ListIndexView lists={lists} />}
    </QueryBoundary>
  );
}
