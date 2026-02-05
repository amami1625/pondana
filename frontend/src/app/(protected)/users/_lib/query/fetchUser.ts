import { userWithStatsSchema, type UserWithStats } from '@/app/(protected)/users/_types';

export async function fetchUser(id: string): Promise<UserWithStats> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return userWithStatsSchema.parse(data);
}
