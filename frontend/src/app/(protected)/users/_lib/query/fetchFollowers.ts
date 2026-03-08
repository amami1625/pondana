import { type User, userSchema } from '@/app/(protected)/users/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchFollowers = (userId: string): Promise<User[]> =>
  fetchResource(`/api/users/${userId}/followers`, userSchema.array());
