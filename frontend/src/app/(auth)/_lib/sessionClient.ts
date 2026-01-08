'use client';

import { createBrowserSupabaseClient } from '@/supabase/clients/browser';
import { translateAuthError } from '@/lib/utils/translateAuthError';
import { LoginFormData } from '@/schemas/auth';

/**
 * クライアント側でログイン処理を実行
 *
 * この関数はブラウザ側で実行され、localStorageにセッション情報を保存します。
 * これにより、onAuthStateChangeイベントが発火し、タブ間同期が可能になります。
 *
 * @param data ログインフォームデータ（email, password）
 * @returns エラーメッセージ、またはnull（成功時）
 *
 * @example
 * const error = await loginClientSide({ email, password });
 * if (error) {
 *   toast.error(error);
 * }
 */
export async function loginClientSide(data: LoginFormData): Promise<string | null> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return translateAuthError(error.message);
  }

  return null;
}

/**
 * クライアント側でログアウト処理を実行
 *
 * この関数はブラウザ側で実行され、localStorageからセッション情報を削除します。
 * これにより、onAuthStateChangeイベント（SIGNED_OUT）が発火し、
 * タブ間同期が可能になります。
 *
 * @returns エラーメッセージ、またはnull（成功時）
 *
 * @example
 * const error = await logoutClientSide();
 * if (error) {
 *   toast.error(error);
 * }
 */
export async function logoutClientSide(): Promise<string | null> {
  const supabase = createBrowserSupabaseClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return translateAuthError(error.message);
  }

  return null;
}
