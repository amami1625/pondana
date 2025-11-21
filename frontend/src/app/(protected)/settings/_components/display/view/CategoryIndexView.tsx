'use client';

import { Category } from '@/app/(protected)/categories/_types';
import { useSettingCategory } from '@/app/(protected)/settings/_hooks/useSettingCategory';
import SettingsItem from '@/app/(protected)/settings/_components/display/SettingsItem';
import CategoryModal from '@/app/(protected)/categories/_components/modal';

interface CategoryIndexViewProps {
  categories: Category[];
}

export default function CategoryIndexView({ categories }: CategoryIndexViewProps) {
  const { editingCategory, handleEdit, handleCreate, handleDelete, createModal, editModal } =
    useSettingCategory();

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">カテゴリー管理</h2>
          <button
            onClick={handleCreate}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            新規作成
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">カテゴリーが登録されていません</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories?.map((category, index) => (
              <SettingsItem
                key={category.id}
                label={category.name}
                value={`作成日: ${category.created_at}`}
                isLast={index === categories.length - 1}
                onEdit={() => handleEdit(category)}
                onDelete={() => handleDelete(category.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 作成モーダル */}
      <CategoryModal isOpen={createModal.isOpen} onClose={createModal.close} />

      {/* 編集モーダル */}
      <CategoryModal
        category={editingCategory}
        isOpen={editModal.isOpen}
        onClose={editModal.close}
      />
    </>
  );
}
