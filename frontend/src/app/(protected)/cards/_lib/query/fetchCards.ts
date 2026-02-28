import { cardListSchema, type CardList } from '@/app/(protected)/cards/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchCards = (): Promise<CardList> => fetchResource('/api/cards', cardListSchema);
