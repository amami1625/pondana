import { bookSchema, type Book } from '@/schemas/book';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchUserBooks = (id: string): Promise<Book[]> =>
  fetchResource(`/api/users/${id}/books`, bookSchema.array());
