import { Category, CategoryFormData, categorySchema } from '@/app/(protected)/categories/_types';

export async function createCategory(data: CategoryFormData): Promise<Category> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return categorySchema.parse(res);
}
