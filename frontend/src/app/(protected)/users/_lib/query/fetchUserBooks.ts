import { bookSchema, type Book } from '@/schemas/book';

export async function fetchUserBooks(id: string): Promise<Book[]> {
  const response = await fetch(`/api/users/${id}/books`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return bookSchema.array().parse(data);
}
