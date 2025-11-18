import { useModal } from '@/hooks/useModal';
import { useBookMutations } from '@/app/(protected)/books/_hooks/useBookMutations';
import { getBookDetailBreadcrumbs } from '@/lib/utils';
import { BookDetail } from '@/app/(protected)/books/_types';
import CategoryBadge from '@/components/badge/CategoryBadge';
import PublicBadge from '@/components/badge/PublicBadge';

export function useBookDetailView(book: BookDetail) {
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
  const subtitle = `著者: ${book.authors.map((author) => author.name).join(', ')}`;

  // バッジ
  const badges = (
    <>
      {book.category && <CategoryBadge label={book.category.name} />}
      <PublicBadge isPublic={book.public} />
    </>
  );

  return {
    breadcrumbItems,
    subtitle,
    badges,
    handleDelete,
    updateModal,
    addListModal,
    cardModal,
  };
}
