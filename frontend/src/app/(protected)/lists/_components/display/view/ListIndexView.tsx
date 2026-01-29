'use client';

import { List } from '@/app/(protected)/lists/_types';
import { Plus } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import PageTitle from '@/components/layout/PageTitle';
import ListCard from '@/app/(protected)/lists/_components/display/ListCard';
import CreateListFormModal from '@/app/(protected)/lists/_components/modal/';
import Button from '@/components/buttons/Button';
import EmptyState from '@/components/feedback/EmptyState';

interface ListIndexViewProps {
  lists: List[];
}

export default function ListIndexView({ lists }: ListIndexViewProps) {
  const createModal = useModal();

  return (
    <>
      <PageTitle title="リスト一覧" />
      <div className="mb-6 flex justify-end">
        <Button variant="primary" onClick={createModal.open} icon={<Plus className="h-4 w-4" />}>
          リストを新規作成
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
