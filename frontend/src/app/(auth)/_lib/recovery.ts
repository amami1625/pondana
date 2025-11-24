import 'server-only';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/supabase/clients/server';

/**
 * パスワードリセット用のrecoveryセッションを要求する
 * - 認証されていない場合: /loginへリダイレクト
 * - recoveryセッションでない場合: /settingsへリダイレクト
 * - recoveryセッションの場合: 正常に返る
 *
 * パスワードリセットページ専用。メールのリンク経由でのみアクセス可能にする。
 */
export async function requireRecoverySession(): Promise<void> {
  const supabase = await createServerSupabaseClient();

  // ユーザーを検証（Supabaseサーバーで認証を確認）
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 認証されていない場合はログインページへリダイレクト
  if (error || !user) {
    redirect('/login');
  }

  // 認証方法を確認（AMR: Authentication Methods Reference）
  const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  // リカバリーセッションかどうかを確認
  const isRecoverySession = aalData?.currentAuthenticationMethods?.some(
    (method) => method.method === 'recovery',
  );

  // パスワードリセットリンクからのアクセスでない場合は設定ページへリダイレクト
  if (!isRecoverySession) {
    redirect('/settings');
  }
}
