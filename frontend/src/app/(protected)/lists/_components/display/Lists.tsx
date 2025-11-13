'use client';

import { List } from '@/app/(protected)/lists/_types';
import { useModal } from '@/hooks/useModal';
import { CreateButton } from '@/components/buttons';
import CreateListFormModal from '@/app/(protected)/lists/_components/modal/';
import ListCard from '@/app/(protected)/lists/_components/display/ListCard';
import EmptyState from '@/components/EmptyState';

interface ListProps {
  lists: List[];
}

export default function Lists({ lists }: ListProps) {
  const createModal = useModal();

  return (
    <>
      <div className="mb-6 flex justify-end">
        <CreateButton onClick={createModal.open} />
      </div>
      {lists.length === 0 ? (
        <EmptyState element="リスト" />
      ) : (
        <div className="space-y-3">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
      <CreateListFormModal isOpen={createModal.isOpen} onClose={createModal.close} />
    </>
  );
}
