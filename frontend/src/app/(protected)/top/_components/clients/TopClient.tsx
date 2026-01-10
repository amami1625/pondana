'use client';

import { useTopPageData } from '@/app/(protected)/top/_hooks/useTopPageData';
import TopView from '@/app/(protected)/top/_components/view/TopView';
import QueryBoundary from '@/components/data/QueryBoundary';

export default function TopClient() {
  const query = useTopPageData();

  return (
    <QueryBoundary {...query} loadingMessage="データを読み込んでいます...">
      {(topPageData) => (
        <TopView
          books={topPageData.recent_books}
          lists={topPageData.recent_lists}
          cards={topPageData.recent_cards}
        />
      )}
    </QueryBoundary>
  );
}
