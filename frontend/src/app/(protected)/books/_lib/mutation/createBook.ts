import { type BookBase, bookBaseSchema, type BookCreateData } from '@/app/(protected)/books/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export const createBook = (data: BookCreateData): Promise<BookBase> =>
  mutateResource('/api/books', 'POST', data, bookBaseSchema);
