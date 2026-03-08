import { mutateResource } from '@/lib/api/mutateResource';

export const deleteCard = ({ bookId, cardId }: { bookId: string; cardId: string }): Promise<void> =>
  mutateResource(`/api/books/${bookId}/cards/${cardId}`, 'DELETE');
