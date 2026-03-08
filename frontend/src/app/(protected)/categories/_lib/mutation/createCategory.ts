import {
  type Category,
  type CategoryFormData,
  categorySchema,
} from '@/app/(protected)/categories/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export const createCategory = (data: CategoryFormData): Promise<Category> =>
  mutateResource('/api/categories', 'POST', data, categorySchema);
