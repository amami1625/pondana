import { useState } from 'react';
import { Tag } from '@/app/(protected)/tags/_types';
import { useModal } from '@/hooks/useModal';

export function useSettingTag() {
  const [editingTag, setEditingTag] = useState<Tag | undefined>();
  const createModal = useModal();
  const editModal = useModal();

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    editModal.open();
  };

  const handleCreate = () => {
    setEditingTag(undefined);
    createModal.open();
  };

  return {
    editingTag,
    handleEdit,
    handleCreate,
    createModal,
    editModal,
  };
}
