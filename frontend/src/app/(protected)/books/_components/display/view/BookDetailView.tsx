'use client';

import { BookDetail } from '@/app/(protected)/books/_types';
import { useModal } from '@/hooks/useModal';
import { useBookMutations } from '@/app/(protected)/books/_hooks/useBookMutations';
import { getBookDetailBreadcrumbs } from '@/lib/utils';
import UpdateBookFormModal from '@/app/(protected)/books/_components/modal';
import AddListModal from '@/app/(protected)/listBooks/_components/modal/AddListModal';
import CardModal from '@/app/(protected)/cards/_components/modal';
import {
  DetailContainer,
  DetailCard,
  DetailHeader,
  DetailDescription,
  DetailMetadata,
} from '@/components/details';
import CategoryBadge from '@/components/badge/CategoryBadge';
import PublicBadge from '@/components/badge/PublicBadge';
import BookActions from '@/app/(protected)/books/_components/detail/BookActions';
import BookDetailTabs from '@/app/(protected)/books/_components/detail/tab/BookDetailTabs';

interface BookDetailProps {
  book: BookDetail;
}

export default function BookDetailView({ book }: BookDetailProps) {
  const { deleteBook } = useBookMutations();
  const updateModal = useModal();
  const addListModal = useModal();
  const cardModal = useModal();

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteBook(id);
  };

  // パンくずリストのアイテム
  const breadcrumbItems = getBookDetailBreadcrumbs(book.title);

  // 著者情報のサブタイトル
  const subtitle =
    book.authors && book.authors.length > 0
      ? `著者: ${book.authors.map((author) => author.name).join(', ')}`
      : undefined;

  // バッジ
  const badges = (
    <>
      {book.category && <CategoryBadge label={book.category.name} />}
      <PublicBadge isPublic={book.public} />
    </>
  );

  return (
    <>
      <DetailContainer breadcrumbItems={breadcrumbItems}>
        <DetailCard>
          <DetailHeader title={book.title} subtitle={subtitle} badges={badges} />
          <DetailDescription>
            {book.description || '説明が登録されていません。'}
          </DetailDescription>
          <DetailMetadata createdAt={book.created_at} updatedAt={book.updated_at} />
          <BookActions
            onEdit={updateModal.open}
            onAddToList={addListModal.open}
            onCreateCard={cardModal.open}
            onDelete={() => handleDelete(book.id)}
          />
        </DetailCard>

        {/* タブ切り替え */}
        <BookDetailTabs lists={book.lists} cards={book.cards} />
      </DetailContainer>

      {/* モーダル */}
      <UpdateBookFormModal book={book} isOpen={updateModal.isOpen} onClose={updateModal.close} />
      <AddListModal
        bookId={book.id}
        listIds={book.lists.map((list) => list.id)}
        isOpen={addListModal.isOpen}
        onClose={addListModal.close}
      />
      <CardModal
        bookId={book.id}
        bookTitle={book.title}
        isOpen={cardModal.isOpen}
        onClose={cardModal.close}
      />
    </>
  );
}
