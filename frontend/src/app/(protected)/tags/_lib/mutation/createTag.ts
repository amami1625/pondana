import { Tag, TagFormData, tagSchema } from '@/app/(protected)/tags/_types';

export async function createTag(data: TagFormData): Promise<Tag> {
  const response = await fetch('/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return tagSchema.parse(res);
}
