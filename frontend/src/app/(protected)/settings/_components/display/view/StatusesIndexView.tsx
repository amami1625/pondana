'use client';

import { Status } from '@/app/(protected)/statuses/_types';
import SettingsItem from '@/app/(protected)/settings/_components/display/SettingsItem';
import StatusModal from '@/app/(protected)/statuses/_components/modal';
import { useSettingStatus } from '@/app/(protected)/settings/_hooks/useSettingStatus';
import Button from '@/components/buttons/Button';

interface StatusesIndexViewProps {
  statuses: Status[];
}

export default function StatusesIndexView({ statuses }: StatusesIndexViewProps) {
  const { editingStatus, handleEdit, handleCreate, handleDelete, createModal, editModal } =
    useSettingStatus();

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">ステータス管理</h2>
          <Button variant="primary" onClick={handleCreate}>
            新規作成
          </Button>
        </div>

        {statuses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">ステータスが登録されていません</p>
          </div>
        ) : (
          <div className="space-y-6">
            {statuses?.map((status, index) => (
              <SettingsItem
                key={status.id}
                label={status.name}
                value={`作成日: ${status.created_at}`}
                isLast={index === statuses.length - 1}
                onEdit={() => handleEdit(status)}
                onDelete={() => handleDelete(status.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 作成モーダル */}
      <StatusModal isOpen={createModal.isOpen} onClose={createModal.close} />

      {/* 編集モーダル */}
      <StatusModal status={editingStatus} isOpen={editModal.isOpen} onClose={editModal.close} />
    </>
  );
}
