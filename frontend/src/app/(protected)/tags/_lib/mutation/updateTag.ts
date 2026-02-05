import { Tag, TagFormData, tagSchema } from '@/app/(protected)/tags/_types';

export async function updateTag(data: TagFormData & { id: number }): Promise<Tag> {
  const { id, ...updateData } = data;
  const response = await fetch(`/api/tags/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return tagSchema.parse(res);
}
