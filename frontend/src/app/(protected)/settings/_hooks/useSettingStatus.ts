import { useState } from 'react';
import { Status } from '@/app/(protected)/statuses/_types';
import { useModal } from '@/hooks/useModal';
import { useStatusMutations } from '@/app/(protected)/statuses/_hooks/useStatusMutations';

export function useSettingStatus() {
  const [editingStatus, setEditingStatus] = useState<Status | undefined>();
  const { deleteStatus } = useStatusMutations();
  const createModal = useModal();
  const editModal = useModal();

  const handleEdit = (status: Status) => {
    setEditingStatus(status);
    editModal.open();
  };

  const handleCreate = () => {
    setEditingStatus(undefined);
    createModal.open();
  };

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteStatus(id);
  };

  return {
    editingStatus,
    handleEdit,
    handleCreate,
    handleDelete,
    createModal,
    editModal,
  };
}
