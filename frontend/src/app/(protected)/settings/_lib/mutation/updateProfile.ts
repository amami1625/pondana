import { User, UserFormData, userSchema } from '@/schemas/user';

export async function updateProfile(data: UserFormData): Promise<User> {
  const response = await fetch('/api/profiles', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return userSchema.parse(res);
}
