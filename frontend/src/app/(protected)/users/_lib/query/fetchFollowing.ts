import { User, userSchema } from '@/app/(protected)/users/_types';

export async function fetchFollowing(userId: string): Promise<User[]> {
  const response = await fetch(`/api/users/${userId}/following`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return userSchema.array().parse(data);
}
