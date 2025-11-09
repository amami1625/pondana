'use client';

import { useState } from 'react';
import { Category } from '@/app/(protected)/categories/_types';
import { useCategories } from '@/app/(protected)/categories/_hooks/useCategories';
import { useCategoryMutations } from '@/app/(protected)/categories/_hooks/useCategoryMutations';
import { useModal } from '@/hooks/useModal';
import SettingsItem from '@/app/(protected)/settings/_components/display/SettingsItem';
import CategoryModal from '@/app/(protected)/categories/_components/modal';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingState from '@/components/LoadingState';

export default function SettingsCategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();
  const { deleteCategory, deleteError } = useCategoryMutations();
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const createModal = useModal();
  const editModal = useModal();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    editModal.open();
  };

  const handleCreate = () => {
    setEditingCategory(undefined);
    createModal.open();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteCategory(id);
  };

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="カテゴリを読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // データが取得できていない場合
  if (!categories) {
    return <ErrorMessage message="著者情報の取得に失敗しました" />;
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">カテゴリー管理</h2>
          {deleteError && <ErrorMessage message={deleteError.message} />}
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
