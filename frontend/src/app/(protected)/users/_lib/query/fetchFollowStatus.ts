import { FollowStatus, followStatusSchema } from '@/app/(protected)/users/_types';

export async function fetchFollowStatus(userId: string): Promise<FollowStatus> {
  const response = await fetch(`/api/users/${userId}/follow-status`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return followStatusSchema.parse(data);
}
