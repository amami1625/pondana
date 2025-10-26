'use client';

import { ListDetail } from '@/app/(protected)/lists/_types';
import { Book } from '@/app/(protected)/books/_types';
import { useUpdateList } from '@/app/(protected)/lists/_hooks/useUpdateList';
import { useDeleteList } from '@/app/(protected)/lists/_hooks/useDeleteList';
import { useAddBookModal } from '@/app/(protected)/listBooks/_hooks/useAddBookModal';
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

interface ListDetailProps {
  list: ListDetail;
  books: Book[];
}

export default function ListDetailView({ list, books }: ListDetailProps) {
  const { isUpdateFormOpen, openUpdateForm, closeUpdateForm } = useUpdateList();
  const { isAddBookModalOpen, openAddBookModal, closeAddBookModal } = useAddBookModal();
  const { error, handleDelete } = useDeleteList(list.id);

  return (
    <>
      <DetailContainer error={error}>
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
          <UpdateButton onClick={openUpdateForm} />
          <DeleteButton onClick={handleDelete} />
          <AddButton onClick={openAddBookModal} />
        </DetailActions>

        <AddedBooksView books={list.books} listBooks={list.list_books} />
      </DetailContainer>

      <UpdateListFormModal list={list} isOpen={isUpdateFormOpen} onClose={closeUpdateForm} />
      <AddBookModal
        listId={list.id}
        books={books}
        isOpen={isAddBookModalOpen}
        onClose={closeAddBookModal}
      />
    </>
  );
}
