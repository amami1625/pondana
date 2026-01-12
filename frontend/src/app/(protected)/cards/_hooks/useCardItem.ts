import { useRouter } from 'next/navigation';
import { Card } from '@/app/(protected)/cards/_types';
import { useCardMutations } from '@/app/(protected)/cards/_hooks/useCardMutations';

export function useCardItem(card: Card) {
  const router = useRouter();
  const { deleteCard } = useCardMutations();

  const handleDelete = () => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteCard(
      { bookId: card.book_id, cardId: card.id },
      {
        onSuccess: () => {
          router.push('/cards');
        },
      },
    );
  };

  return { handleDelete };
}
