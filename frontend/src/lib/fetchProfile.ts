import { userSchema, type User } from '@/schemas/user';

export async function fetchProfile(): Promise<User> {
  const response = await fetch('/api/profiles');

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const data = await response.json();
  return userSchema.parse(data);
}
