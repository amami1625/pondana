import { BookBase, bookBaseSchema, BookCreateData } from '@/app/(protected)/books/_types';

export async function createBook(data: BookCreateData): Promise<BookBase> {
  const response = await fetch('/api/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return bookBaseSchema.parse(res);
}
