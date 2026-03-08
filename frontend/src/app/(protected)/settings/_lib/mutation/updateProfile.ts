import { type User, type UserFormData, userSchema } from '@/schemas/user';
import { mutateResource } from '@/lib/api/mutateResource';

export const updateProfile = (data: UserFormData): Promise<User> =>
  mutateResource('/api/profiles', 'PUT', data, userSchema);
