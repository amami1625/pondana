import { categorySchema, type Category } from '@/app/(protected)/categories/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchCategories = (): Promise<Category[]> =>
  fetchResource('/api/categories', categorySchema.array());
