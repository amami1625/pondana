import { BookBase, bookBaseSchema, BookUpdateData } from '@/app/(protected)/books/_types';

export async function updateBook(data: BookUpdateData): Promise<BookBase> {
  const response = await fetch(`/api/books/${data.id}`, {
    method: 'PUT',
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
