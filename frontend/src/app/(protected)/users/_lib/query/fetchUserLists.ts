import { listSchema, type List } from '@/schemas/list';

export async function fetchUserLists(id: string): Promise<List[]> {
  const response = await fetch(`/api/users/${id}/lists`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return listSchema.array().parse(data);
}
