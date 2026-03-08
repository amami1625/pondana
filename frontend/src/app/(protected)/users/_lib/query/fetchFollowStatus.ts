import { type FollowStatus, followStatusSchema } from '@/app/(protected)/users/_types';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchFollowStatus = (userId: string): Promise<FollowStatus> =>
  fetchResource(`/api/users/${userId}/follow-status`, followStatusSchema);
