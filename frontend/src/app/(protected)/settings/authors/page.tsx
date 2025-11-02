'use client';

import { useState } from 'react';
import { Author } from '@/app/(protected)/authors/_types';
import SettingsItem from '@/app/(protected)/settings/_components/display/SettingsItem';
import AuthorModal from '@/app/(protected)/authors/_components/modal';
import { useAuthors } from '@/app/(protected)/authors/_hooks/useAuthors';
import { useAuthorMutations } from '../../authors/_hooks/useAuthorMutations';
import { useModal } from '@/hooks/useModal';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingState from '@/components/LoadingState';

export default function SettingsAuthorsPage() {
  const { data: authors, isLoading, error } = useAuthors();
  const [editingAuthor, setEditingAuthor] = useState<Author | undefined>();
  const createModal = useModal();
  const editModal = useModal();
  const { deleteAuthor, deleteError } = useAuthorMutations();

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    editModal.open();
  };

  const handleCreate = () => {
    setEditingAuthor(undefined);
    createModal.open();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteAuthor(id);
  };

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="著者情報を読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">著者情報管理</h2>
          {deleteError && <ErrorMessage message={deleteError.message} />}
          <button
            onClick={handleCreate}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            新規作成
          </button>
        </div>

        {authors && authors.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">著者情報が登録されていません</p>
          </div>
        ) : (
          <div className="space-y-6">
            {authors?.map((author, index) => (
              <SettingsItem
                key={author.id}
                label={author.name}
                value={`作成日: ${author.created_at}`}
                isLast={index === authors.length - 1}
                onEdit={() => handleEdit(author)}
                onDelete={() => handleDelete(author.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 作成モーダル */}
      <AuthorModal isOpen={createModal.isOpen} onClose={createModal.close} />

      {/* 編集モーダル */}
      <AuthorModal author={editingAuthor} isOpen={editModal.isOpen} onClose={editModal.close} />
    </>
  );
}
