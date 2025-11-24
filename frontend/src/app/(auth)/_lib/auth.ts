'use server';

import { createServerSupabaseClient } from '@/supabase/clients/server';
import { translateAuthError } from '@/lib/utils/translateAuthError';

/**
 * パスワードを検証してからパスワード変更用のメールを送信する
 * 現在のパスワードが正しい場合のみメールを送信
 */
export async function verifyAndSendPasswordResetEmail(currentPassword: string) {
  const supabase = await createServerSupabaseClient();

  // 現在のユーザーを取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return { error: 'ユーザー情報の取得に失敗しました' };
  }

  // 現在のパスワードで再認証して検証
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'パスワードが正しくありません' };
  }

  // パスワードリセットメールを送信
  // コールバックルート経由でセッションを確立後、パスワードリセットページへリダイレクト
  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/password-reset`,
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  return { success: true };
}

/**
 * メールアドレス変更用の確認メールを送信する
 * 現在のメールアドレスと新しいメールアドレス両方に確認メールを送信
 */
export async function sendEmailChangeConfirmation(newEmail: string) {
  const supabase = await createServerSupabaseClient();

  // 現在のユーザーを取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'ユーザー情報の取得に失敗しました' };
  }

  // メールアドレス変更をリクエスト（確認メールが送信される）
  // メール確認後はログインページへリダイレクト
  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login` },
  );

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  return { success: true };
}

/**
 * パスワードを更新する
 * パスワードリセットリンクからアクセスした場合に使用
 */
export async function updatePassword(newPassword: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  return { success: true };
}
