'use client';

import { useModal } from '@/hooks/useModal';
import { useLists } from '@/app/(protected)/lists/_hooks/useLists';
import PageTitle from '@/components/PageTitle';
import ListCard from './_components/display/ListCard';
import CreateListFormModal from '@/app/(protected)/lists/_components/modal/';
import Button from '@/components/buttons/Button';
import { Plus } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingState from '@/components/LoadingState';

export default function ListPage() {
  const { data: lists, error, isLoading } = useLists();
  const createModal = useModal();

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="リスト一覧を読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <PageTitle title="リスト一覧" />
      <div className="mb-6 flex justify-end">
        <Button variant="create" onClick={createModal.open} icon={<Plus className="h-4 w-4" />}>
          作成
        </Button>
      </div>
      {lists && lists.length === 0 ? (
        <EmptyState element="リスト" />
      ) : (
        <div className="space-y-3">
          {lists?.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
      <CreateListFormModal isOpen={createModal.isOpen} onClose={createModal.close} />
    </>
  );
}
