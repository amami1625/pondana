'use client';

import { useModal } from '@/hooks/useModal';
import { formatVisibility } from '@/lib/utils/formatVisibility';
import UpdateListFormModal from '@/app/(protected)/lists/_components/modal';
import AddBookModal from '@/app/(protected)/listBooks/_components/modal/AddBookModal';
import AddedBooksView from '@/app/(protected)/lists/_components/display/AddedBooksView';
import Button from '@/components/buttons/Button';
import {
  DetailContainer,
  DetailHeader,
  DetailSection,
  DetailMetadata,
  DetailMetadataItem,
  DetailActions,
} from '@/components/details';
import { useListMutations } from '@/app/(protected)/lists/_hooks/useListMutations';
import { ListDetail } from '@/schemas/list';

interface ListDetailProps {
  list: ListDetail;
}

export default function ListDetailView({ list }: ListDetailProps) {
  const { deleteList, deleteError } = useListMutations();
  const updateModal = useModal();
  const addBookModal = useModal();

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteList(id);
  };

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
          <Button variant="update" onClick={updateModal.open}>
            編集
          </Button>
          <Button variant="delete" onClick={() => handleDelete(list.id)}>
            削除
          </Button>
          <Button variant="add" onClick={addBookModal.open}>
            追加
          </Button>
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
