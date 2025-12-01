'use client';

import { useTags } from '@/app/(protected)/tags/_hooks/useTags';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import LoadingState from '@/components/feedback/LoadingState';
import TagsIndexView from '@/app/(protected)/settings/_components/display/view/TagsIndexView';

export default function TagsClient() {
  const { data: tags, isLoading, error } = useTags();

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="タグ情報を読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // データが取得できていない場合
  if (!tags) {
    return <ErrorMessage message="タグ情報の取得に失敗しました" />;
  }

  return <TagsIndexView tags={tags} />;
}
