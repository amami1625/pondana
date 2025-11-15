'use client';

import { useParams } from 'next/navigation';
import { useList } from '@/app/(protected)/lists/_hooks/useList';
import ListDetailView from '@/app/(protected)/lists/_components/display/view/ListDetailView';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';

export default function ListPage() {
  const { id } = useParams();
  const { data: list, error: listError, isLoading: listLoading } = useList(Number(id));

  // ローディング状態
  if (listLoading) {
    return <LoadingState message="リストを読み込んでいます..." />;
  }

  // エラー状態
  if (listError) {
    return <ErrorMessage message={listError?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!list) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <ListDetailView list={list} />;
}
