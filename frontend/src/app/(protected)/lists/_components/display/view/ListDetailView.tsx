'use client';

import { useListDetailView } from '@/app/(protected)/lists/_hooks/useListDetailView';
import UpdateListFormModal from '@/app/(protected)/lists/_components/modal';
import AddBookModal from '@/app/(protected)/listBooks/_components/modal/AddBookModal';
import AddedBooks from '@/app/(protected)/lists/_components/display/AddedBooks';
import {
  DetailContainer,
  DetailCard,
  DetailHeader,
  DetailDescription,
  DetailMetadata,
  DetailOwner,
} from '@/components/details';
import ListActions from '@/app/(protected)/lists/_components/detail/ListActions';
import { ListDetail } from '@/schemas/list';
import { useProfile } from '@/hooks/useProfile';

interface ListDetailProps {
  list: ListDetail;
}

export default function ListDetailView({ list }: ListDetailProps) {
  const { breadcrumbItems, badges, handleDelete, updateModal, addBookModal } =
    useListDetailView(list);
  const { data: profile } = useProfile();

  // ログインユーザーがリストの所有者かどうかを判定
  const isOwner = profile?.id === list.user_id;

  return (
    <>
      <DetailContainer breadcrumbItems={isOwner ? breadcrumbItems : undefined}>
        {/* 所有者でない場合、ユーザー名を表示 */}
        {!isOwner && <DetailOwner userId={list.user_id} name={list.user.name} />}
        <DetailCard>
          <DetailHeader title={list.name} badges={badges} />
          <DetailDescription description={list.description} />
          <DetailMetadata createdAt={list.created_at} updatedAt={list.updated_at} />
          {/* 所有者の場合のみ編集・削除ボタンを表示 */}
          {isOwner && (
            <ListActions
              onEdit={updateModal.open}
              onAddBook={addBookModal.open}
              onDelete={() => handleDelete(list.id)}
            />
          )}
        </DetailCard>

        {/* 追加済みの本 */}
        <AddedBooks books={list.books} listBooks={list.list_books} isOwner={isOwner} />
      </DetailContainer>

      {/* 所有者の場合のみモーダルを表示できるようにする */}
      {isOwner && (
        <>
          <UpdateListFormModal
            list={list}
            isOpen={updateModal.isOpen}
            onClose={updateModal.close}
          />
          <AddBookModal
            listId={list.id}
            bookIds={list.books.map((book) => book.id)}
            isOpen={addBookModal.isOpen}
            onClose={addBookModal.close}
          />
        </>
      )}
    </>
  );
}
