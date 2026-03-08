import { listDetailSchema, type ListDetail } from '@/app/(protected)/lists/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchList = (id: string): Promise<ListDetail> =>
  fetchResource(`/api/lists/${id}`, listDetailSchema);
