'use client';

import { useModal } from '@/hooks/useModal';
import { getListDetailBreadcrumbs } from '@/lib/utils';
import UpdateListFormModal from '@/app/(protected)/lists/_components/modal';
import AddBookModal from '@/app/(protected)/listBooks/_components/modal/AddBookModal';
import AddedBooks from '@/app/(protected)/lists/_components/display/AddedBooks';
import {
  DetailContainer,
  DetailCard,
  DetailHeader,
  DetailDescription,
  DetailMetadata,
} from '@/components/details';
import PublicBadge from '@/components/badge/PublicBadge';
import ListActions from '@/app/(protected)/lists/_components/detail/ListActions';
import { useListMutations } from '@/app/(protected)/lists/_hooks/useListMutations';
import { ListDetail } from '@/schemas/list';

interface ListDetailProps {
  list: ListDetail;
}

export default function ListDetailView({ list }: ListDetailProps) {
  const { deleteList } = useListMutations();
  const updateModal = useModal();
  const addBookModal = useModal();

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteList(id);
  };

  // パンくずリストのアイテム
  const breadcrumbItems = getListDetailBreadcrumbs(list.name);

  return (
    <>
      <DetailContainer breadcrumbItems={breadcrumbItems}>
        <DetailCard>
          <DetailHeader
            title={list.name}
            badges={<PublicBadge isPublic={list.public} />}
          />
          <DetailDescription>
            {list.description || '説明が登録されていません。'}
          </DetailDescription>
          <DetailMetadata createdAt={list.created_at} updatedAt={list.updated_at} />
          <ListActions
            onEdit={updateModal.open}
            onAddBook={addBookModal.open}
            onDelete={() => handleDelete(list.id)}
          />
        </DetailCard>

        {/* 追加済みの本 */}
        <AddedBooks books={list.books} listBooks={list.list_books} />
      </DetailContainer>

      {/* モーダル */}
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
