import { useModal } from '@/hooks/useModal';
import { useBookMutations } from '@/app/(protected)/books/_hooks/useBookMutations';
import { getBookDetailBreadcrumbs } from '@/lib/utils';
import { BookDetail } from '@/app/(protected)/books/_types';
import { CategoryBadge, TagBadge, PublicBadge, ReadingStatusBadge } from '@/components/badges';

export function useBookDetailView(book: BookDetail) {
  const { deleteBook } = useBookMutations();
  const updateModal = useModal();
  const addListModal = useModal();
  const cardModal = useModal();

  const handleDelete = (id: string) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }
    deleteBook({ id });
  };

  // パンくずリストのアイテム
  const breadcrumbItems = getBookDetailBreadcrumbs(book.title);

  // バッジ
  const badges = (
    <>
      <ReadingStatusBadge label={book.reading_status} />
      {book.category && <CategoryBadge label={book.category.name} />}
      {book.tags &&
        book.tags.length > 0 &&
        book.tags.map((tag) => <TagBadge key={tag.id} label={tag.name} />)}
      <PublicBadge isPublic={book.public} />
    </>
  );

  return {
    breadcrumbItems,
    badges,
    handleDelete,
    updateModal,
    addListModal,
    cardModal,
  };
}
