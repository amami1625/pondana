import { type ListBase, listBaseSchema, type ListFormData } from '@/app/(protected)/lists/_types';
import { mutateResource } from '@/lib/api/mutateResource';

export const createList = (data: ListFormData): Promise<ListBase> =>
  mutateResource('/api/lists', 'POST', data, listBaseSchema);
