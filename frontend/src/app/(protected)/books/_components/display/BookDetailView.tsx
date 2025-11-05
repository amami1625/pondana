'use client';

import UpdateBookFormModal from '@/app/(protected)/books/_components/modal';
import { STATUS_LABEL } from '@/app/(protected)/books/_constants';
import { formatRating, formatVisibility } from '@/lib/utils';
import { UpdateButton, DeleteButton, AddButton, CreateCardButton } from '@/components/Buttons';
import AddListModal from '@/app/(protected)/listBooks/_components/modal/AddListModal';
import AddedListsView from '@/app/(protected)/books/_components/display/AddedListsView';
import CardModal from '@/app/(protected)/cards/_components/modal';
import CreatedCardsView from '@/app/(protected)/books/_components/display/CreatedCardsView';
import { createCard } from '@/app/(protected)/cards/_lib/actions';
import {
  DetailContainer,
  DetailHeader,
  DetailSection,
  DetailMetadata,
  DetailMetadataItem,
  DetailActions,
} from '@/components/details';
import { useModal } from '@/hooks/useModal';
import { useBook } from '@/app/(protected)/books/_hooks/useBook';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import { useBookMutations } from '@/app/(protected)/books/_hooks/useBookMutations';

interface BookDetailProps {
  id: number;
}

export default function BookDetailView({ id }: BookDetailProps) {
  const { data: book, error: bookError, isLoading: bookLoading } = useBook(id);
  const { deleteBook, deleteError } = useBookMutations();
  const updateModal = useModal();
  const addListModal = useModal();
  const cardModal = useModal();

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteBook(id);
  };

  // ローディング状態
  if (bookLoading) {
    return <LoadingState message="本情報を読み込んでいます..." />;
  }

  // エラー状態
  if (bookError) {
    return <ErrorMessage message={bookError?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!book) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  return (
    <>
      <DetailContainer error={deleteError?.message}>
        <DetailHeader
          title={book.title}
          badges={[
            { label: STATUS_LABEL[book.reading_status], variant: 'status' },
            ...(book.category ? [{ label: book.category.name, variant: 'category' as const }] : []),
          ]}
        />

        <DetailSection title="概要">
          <p className="whitespace-pre-line text-base leading-relaxed text-gray-700">
            {book.description || '説明が登録されていません。'}
          </p>
        </DetailSection>

        <DetailMetadata>
          {book.authors && book.authors.length > 0 && (
            <DetailMetadataItem
              label="著者名"
              value={book.authors.map((author) => author.name).join(', ')}
            />
          )}
          <DetailMetadataItem label="評価" value={formatRating(book.rating)} />
          <DetailMetadataItem label="更新日" value={book.updated_at} />
          <DetailMetadataItem label="登録日" value={book.created_at} />
          <DetailMetadataItem label="公開/非公開" value={formatVisibility(book.public)} />
          <DetailMetadataItem label="ID" value={`#${book.id}`} />
        </DetailMetadata>

        <DetailActions>
          <UpdateButton onClick={updateModal.open} />
          <DeleteButton onClick={() => handleDelete(id)} />
          <AddButton onClick={addListModal.open} />
          <CreateCardButton onClick={cardModal.open} />
        </DetailActions>

        <AddedListsView lists={book.lists} listBooks={book.list_books} />
        <CreatedCardsView cards={book.cards} />
      </DetailContainer>

      <UpdateBookFormModal book={book} isOpen={updateModal.isOpen} onClose={updateModal.close} />
      <AddListModal bookId={book.id} isOpen={addListModal.isOpen} onClose={addListModal.close} />
      <CardModal
        action={createCard}
        bookId={book.id}
        bookTitle={book.title}
        isOpen={cardModal.isOpen}
        onClose={cardModal.close}
      />
    </>
  );
}
