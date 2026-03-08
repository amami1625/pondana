import { type Card, type CardFormData, cardSchema } from '@/app/(protected)/cards/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export const createCard = (data: CardFormData): Promise<Card> =>
  mutateResource(`/api/books/${data.book_id}/cards`, 'POST', data, cardSchema);
