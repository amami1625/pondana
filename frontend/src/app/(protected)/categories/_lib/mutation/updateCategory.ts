import { type Category, categorySchema } from '@/app/(protected)/categories/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export interface UpdateCategoryData {
  id: number;
  name: string;
}

export const updateCategory = (data: UpdateCategoryData): Promise<Category> => {
  const { id, ...updateData } = data;
  return mutateResource(`/api/categories/${id}`, 'PUT', updateData, categorySchema);
};
