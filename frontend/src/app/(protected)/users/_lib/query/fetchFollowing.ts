import { type User, userSchema } from '@/app/(protected)/users/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchFollowing = (userId: string): Promise<User[]> =>
  fetchResource(`/api/users/${userId}/following`, userSchema.array());
