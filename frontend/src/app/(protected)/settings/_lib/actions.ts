'use server';

import { UserFormData } from '@/schemas/profile';
import { authenticatedRequest } from '@/supabase/dal';
import { revalidatePath } from 'next/cache';

export const updateProfile = async (
  formData: UserFormData,
): Promise<{ success: true } | { error: string }> => {
  try {
    await authenticatedRequest(`/profile`, {
      method: 'PUT',
      body: JSON.stringify({ profile: formData }),
    });

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: '不明なエラーが発生しました' };
    }
  }
};
