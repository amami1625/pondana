import { cardDetailSchema, type CardDetail } from '@/app/(protected)/cards/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchCard = (id: string): Promise<CardDetail> =>
  fetchResource(`/api/cards/${id}`, cardDetailSchema);
