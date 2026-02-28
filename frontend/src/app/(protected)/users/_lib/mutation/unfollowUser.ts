import { z } from 'zod';
import { mutateResource } from '@/lib/api/mutateResource';

const followResponseSchema = z.object({ message: z.string() });

export const unfollowUser = (userId: string) =>
  mutateResource(`/api/users/${userId}/follow`, 'DELETE', undefined, followResponseSchema);
