'use client';

import { useList } from '@/app/(protected)/lists/_hooks/useList';
import ListDetailView from '@/app/(protected)/lists/_components/display/view/ListDetailView';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import LoadingState from '@/components/feedback/LoadingState';

type Props = {
  id: string;
};

export default function ListDetailClient({ id }: Props) {
  const { data: list, error: listError, isLoading } = useList(id);

  if (isLoading) {
    return <LoadingState message="リストを読み込んでいます..." />;
  }

  if (listError) {
    return <ErrorMessage message={listError?.message} />;
  }

  if (!list) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return <ListDetailView list={list} />;
}
