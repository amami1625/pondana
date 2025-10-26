'use client';

import { BookDetail } from '@/app/(protected)/books/_types';
import { List } from '@/app/(protected)/lists/_types';
import { Author } from '@/app/(protected)/authors/_types';
import { Category } from '@/app/(protected)/categories/_types';
import UpdateBookFormModal from '@/app/(protected)/books/_components/modal';
import { STATUS_LABEL } from '@/app/(protected)/books/_constants';
import { formatRating, formatVisibility } from '@/lib/utils';
import { useUpdateForm, useDeleteBook } from '@/app/(protected)/books/_hooks';
import { useAddListModal } from '@/app/(protected)/listBooks/_hooks/useAddListModal';
import { UpdateButton, DeleteButton, AddButton, CreateCardButton } from '@/components/Buttons';
import AddListModal from '@/app/(protected)/listBooks/_components/modal/AddListModal';
import AddedListsView from '@/app/(protected)/books/_components/display/AddedListsView';
import { useCardModal } from '@/app/(protected)/cards/_hooks/useCardModal';
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

interface BookDetailProps {
  book: BookDetail;
  lists: List[];
  authors: Author[];
  categories: Category[];
}

export default function BookDetailView({ book, lists, authors, categories }: BookDetailProps) {
  const { isUpdateFormOpen, openUpdateForm, closeUpdateForm } = useUpdateForm();
  const { isAddListModalOpen, openAddListModal, closeAddListModal } = useAddListModal();
  const { isCardModalOpen, openCardModal, closeCardModal } = useCardModal();
  const { error, handleDelete } = useDeleteBook(book.id);

  return (
    <>
      <DetailContainer error={error}>
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
          <UpdateButton onClick={openUpdateForm} />
          <DeleteButton onClick={handleDelete} />
          <AddButton onClick={openAddListModal} />
          <CreateCardButton onClick={openCardModal} />
        </DetailActions>

        <AddedListsView lists={book.lists} listBooks={book.list_books} />
        <CreatedCardsView cards={book.cards} />
      </DetailContainer>

      <UpdateBookFormModal
        book={book}
        authors={authors}
        categories={categories}
        isOpen={isUpdateFormOpen}
        onClose={closeUpdateForm}
      />
      <AddListModal
        bookId={book.id}
        lists={lists}
        isOpen={isAddListModalOpen}
        onClose={closeAddListModal}
      />
      <CardModal
        action={createCard}
        bookId={book.id}
        bookTitle={book.title}
        isOpen={isCardModalOpen}
        onClose={closeCardModal}
      />
    </>
  );
}
