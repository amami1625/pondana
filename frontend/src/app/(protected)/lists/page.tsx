'use client';

import { useLists } from '@/app/(protected)/lists/_hooks/useLists';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingState from '@/components/LoadingState';
import ListIndexView from '@/app/(protected)/lists/_components/display/view/ListIndexView';

export default function ListPage() {
  const { data: lists, error, isLoading } = useLists();

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="リスト一覧を読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // データが取得できていない場合
  if (!lists) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <ListIndexView lists={lists} />;
}
