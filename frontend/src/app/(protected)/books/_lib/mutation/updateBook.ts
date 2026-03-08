import { type BookBase, bookBaseSchema, type BookUpdateData } from '@/app/(protected)/books/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export const updateBook = (data: BookUpdateData): Promise<BookBase> =>
  mutateResource(`/api/books/${data.id}`, 'PUT', data, bookBaseSchema);
