import { mutateResource } from '@/lib/api/mutateResource';

export const deleteCategory = (id: number): Promise<void> =>
  mutateResource(`/api/categories/${id}`, 'DELETE');
