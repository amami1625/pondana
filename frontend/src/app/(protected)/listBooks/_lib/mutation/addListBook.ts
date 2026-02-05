import { ListBook, ListBookFormData, listBookSchema } from '@/app/(protected)/listBooks/_types';

export async function addListBook(data: ListBookFormData): Promise<ListBook> {
  const response = await fetch('/api/list_books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return listBookSchema.parse(res);
}
