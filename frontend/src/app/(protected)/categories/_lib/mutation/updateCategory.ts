import { Category, categorySchema } from '@/app/(protected)/categories/_types';

// 更新用の型
export interface UpdateCategoryData {
  id: number;
  name: string;
}

export async function updateCategory(data: UpdateCategoryData): Promise<Category> {
  const { id, ...updateData } = data;
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return categorySchema.parse(res);
}
