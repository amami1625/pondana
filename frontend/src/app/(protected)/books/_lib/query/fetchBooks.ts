import { bookSchema, type Book } from '@/app/(protected)/books/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchBooks = (): Promise<Book[]> => fetchResource('/api/books', bookSchema.array());
