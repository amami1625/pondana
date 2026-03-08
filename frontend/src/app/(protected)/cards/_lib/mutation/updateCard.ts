import { type Card, type CardFormData, cardSchema } from '@/app/(protected)/cards/_types';
import { mutateResource } from '@/lib/api/mutateResource';

type UpdateCardData = CardFormData & { id: string };

export const updateCard = (data: UpdateCardData): Promise<Card> =>
  mutateResource(`/api/books/${data.book_id}/cards/${data.id}`, 'PUT', data, cardSchema);
