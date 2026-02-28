import { type ListBook, type ListBookFormData, listBookSchema } from '@/app/(protected)/listBooks/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export const addListBook = (data: ListBookFormData): Promise<ListBook> =>
  mutateResource('/api/list_books', 'POST', data, listBookSchema);
