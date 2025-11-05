'use client';

import { useModal } from '@/hooks/useModal';
import { formatVisibility } from '@/lib/utils/formatVisibility';
import UpdateListFormModal from '@/app/(protected)/lists/_components/modal';
import AddBookModal from '@/app/(protected)/listBooks/_components/modal/AddBookModal';
import AddedBooksView from '@/app/(protected)/lists/_components/display/AddedBooksView';
import { UpdateButton, DeleteButton, AddButton } from '@/components/Buttons';
import {
  DetailContainer,
  DetailHeader,
  DetailSection,
  DetailMetadata,
  DetailMetadataItem,
  DetailActions,
} from '@/components/details';
import { useList } from '@/app/(protected)/lists/_hooks/useList';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import { useListMutations } from '@/app/(protected)/lists/_hooks/useListMutations';

interface ListDetailProps {
  id: number;
}

export default function ListDetailView({ id }: ListDetailProps) {
  const { data: list, error: listError, isLoading: listLoading } = useList(id);
  const { deleteList, deleteError } = useListMutations();
  const updateModal = useModal();
  const addBookModal = useModal();

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteList(id);
  };

  // ローディング状態
  if (listLoading) {
    return <LoadingState message="リストを読み込んでいます..." />;
  }

  // エラー状態
  if (listError) {
    return <ErrorMessage message={listError?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!list) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return (
    <>
      <DetailContainer error={deleteError?.message}>
        <DetailHeader title={list.name} />

        <DetailSection title="概要">
          <p className="whitespace-pre-line text-base leading-relaxed text-gray-700">
            {list.description || '説明が登録されていません。'}
          </p>
        </DetailSection>

        <DetailMetadata>
          <DetailMetadataItem label="更新日" value={list.updated_at} />
          <DetailMetadataItem label="登録日" value={list.created_at} />
          <DetailMetadataItem label="公開/非公開" value={formatVisibility(list.public)} />
          <DetailMetadataItem label="ID" value={`#${list.id}`} />
        </DetailMetadata>

        <DetailActions>
          <UpdateButton onClick={updateModal.open} />
          <DeleteButton onClick={() => handleDelete(list.id)} />
          <AddButton onClick={addBookModal.open} />
        </DetailActions>

        <AddedBooksView books={list.books} listBooks={list.list_books} />
      </DetailContainer>

      <UpdateListFormModal list={list} isOpen={updateModal.isOpen} onClose={updateModal.close} />
      <AddBookModal
        listId={list.id}
        bookIds={list.books.map((book) => book.id)}
        isOpen={addBookModal.isOpen}
        onClose={addBookModal.close}
      />
    </>
  );
}
