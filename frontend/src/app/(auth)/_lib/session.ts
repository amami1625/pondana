'use server';

import { revalidatePath } from 'next/cache';
import { LoginFormData } from '@/schemas/auth';
import { createServerSupabaseClient } from '@/supabase/clients/server';
import { translateAuthError } from '@/lib/utils/translateAuthError';

export async function loginAction(formData: LoginFormData): Promise<string | null> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    return translateAuthError(error.message);
  }

  revalidatePath('/', 'layout');
  return null;
}

export async function logoutAction(): Promise<string | null> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return translateAuthError(error.message);
  }

  revalidatePath('/', 'layout');
  return null;
}

export async function signUpAction(
  name: string,
  email: string,
  password: string,
): Promise<string | null> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || '',
      },
    },
  });

  if (error) {
    return translateAuthError(error.message);
  }

  revalidatePath('/', 'layout');
  return null;
}
