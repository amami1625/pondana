'use client';

import { useTags } from '@/app/(protected)/tags/_hooks/useTags';
import QueryBoundary from '@/components/data/QueryBoundary';
import TagsIndexView from '@/app/(protected)/settings/_components/display/view/TagsIndexView';

export default function TagsClient() {
  const query = useTags();

  return (
    <QueryBoundary {...query} loadingMessage="タグ情報を読み込んでいます...">
      {(tags) => <TagsIndexView tags={tags} />}
    </QueryBoundary>
  );
}
