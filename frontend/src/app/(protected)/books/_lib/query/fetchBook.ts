import { bookDetailSchema, type BookDetail } from '@/app/(protected)/books/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchBook = (id: string): Promise<BookDetail> =>
  fetchResource(`/api/books/${id}`, bookDetailSchema);
