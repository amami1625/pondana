import { z } from 'zod';
import { mutateResource } from '@/lib/api/mutateResource';

const followResponseSchema = z.object({ message: z.string() });

export const followUser = (userId: string) =>
  mutateResource(`/api/users/${userId}/follow`, 'POST', undefined, followResponseSchema);
