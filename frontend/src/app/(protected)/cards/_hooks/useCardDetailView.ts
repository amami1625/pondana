import { useModal } from '@/hooks/useModal';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';
import { useRouter } from 'next/navigation';
import { CardDetail } from '@/app/(protected)/cards/_types/index';
import { getCardDetailBreadcrumbs } from '@/lib/utils';

export function useCardDetailView(card: CardDetail) {
  const router = useRouter();
  const { deleteCard } = useCardMutations();
  const updateModal = useModal();

  const handleDelete = (bookId: number, cardId: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteCard(
      { bookId, cardId },
      {
        onSuccess: () => {
          router.push('/cards');
        },
      },
    );
  };

  // パンくずリストのアイテム
  const breadcrumbItems = getCardDetailBreadcrumbs(card.title);

  // 書籍名のサブタイトル
  const subtitle = `書籍名: ${card.book.title}`;

  return {
    breadcrumbItems,
    subtitle,
    handleDelete,
    updateModal,
  };
}
