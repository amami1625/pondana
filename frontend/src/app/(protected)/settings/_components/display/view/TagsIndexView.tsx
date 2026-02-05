'use client';

import { Tag } from '@/app/(protected)/tags/_types';
import SettingsItem from '@/app/(protected)/settings/_components/display/SettingsItem';
import TagModal from '@/app/(protected)/tags/_components/modal';
import { useSettingTag } from '@/app/(protected)/settings/_hooks/useSettingTag';
import Button from '@/components/buttons/Button';

interface TagsIndexViewProps {
  tags: Tag[];
}

export default function TagsIndexView({ tags }: TagsIndexViewProps) {
  const { editingTag, handleEdit, handleCreate, handleDelete, createModal, editModal } =
    useSettingTag();

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">タグ管理</h2>
          <Button variant="primary" onClick={handleCreate}>
            新規作成
          </Button>
        </div>

        {tags.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">タグが登録されていません</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tags?.map((tag, index) => (
              <SettingsItem
                key={tag.id}
                label={tag.name}
                value={`作成日: ${tag.created_at}`}
                isLast={index === tags.length - 1}
                onEdit={() => handleEdit(tag)}
                onDelete={() => handleDelete(tag.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 作成モーダル */}
      <TagModal isOpen={createModal.isOpen} onClose={createModal.close} />

      {/* 編集モーダル */}
      <TagModal tag={editingTag} isOpen={editModal.isOpen} onClose={editModal.close} />
    </>
  );
}
