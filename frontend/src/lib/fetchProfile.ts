import { userSchema, type User } from '@/schemas/user';
import { fetchResource } from '@/lib/api/fetchResource';

export const fetchProfile = (): Promise<User> => fetchResource('/api/profiles', userSchema);
