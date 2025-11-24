import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/supabase/clients/server';

/**
 * 認証済みユーザーを /top へリダイレクトする
 * - 認証済みの場合: /top へリダイレクト
 * - 未認証の場合: 何もしない（正常に返る）
 *
 * ログインページ、登録ページなど未認証ユーザー専用ページで使用。
 */
export async function redirectIfAuthenticated(): Promise<void> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!error && user) {
    redirect('/top');
  }
}
