import { tagSchema, type Tag } from '@/app/(protected)/tags/_types';

export async function fetchTags(): Promise<Tag[]> {
  const response = await fetch('/api/tags');

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return tagSchema.array().parse(data);
}
