'use client';

import { createBrowserSupabaseClient } from '@/supabase/clients/browser';

/**
 * GoogleアカウントでOAuthログインを開始
 *
 * この関数を呼び出すと、Googleの認証画面にリダイレクトされます。
 * 認証成功後、/auth/callbackにリダイレクトされ、セッションが確立されます。
 *
 * @returns エラーメッセージ、またはnull（リダイレクト成功時）
 */
export async function signInWithGoogle(): Promise<string | null> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/top`,
    },
  });

  if (error) {
    return error.message;
  }

  return null;
}
