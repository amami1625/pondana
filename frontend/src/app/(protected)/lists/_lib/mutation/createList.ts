import { ListBase, listBaseSchema, ListFormData } from '@/app/(protected)/lists/_types';

export async function createList(data: ListFormData): Promise<ListBase> {
  const response = await fetch('/api/lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return listBaseSchema.parse(res);
}
