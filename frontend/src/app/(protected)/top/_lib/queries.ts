import { profileSchema } from '@/schemas/profile';
import { authenticatedRequest } from '@/supabase/dal';

export async function getProfileData() {
  try {
    const data = await authenticatedRequest('/profile');
    return profileSchema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: '不明なエラーが発生しました' };
    }
  }
}
