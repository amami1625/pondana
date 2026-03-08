import { userWithStatsSchema, type UserWithStats } from '@/app/(protected)/users/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchUser = (id: string): Promise<UserWithStats> =>
  fetchResource(`/api/users/${id}`, userWithStatsSchema);
