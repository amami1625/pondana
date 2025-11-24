import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { EmailOtpType } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';

/**
 * 認証コールバックルートハンドラー
 * OAuth認証やメール確認リンクからのリダイレクトを処理
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  // 環境変数のSITE_URLを使用（Dockerなどで0.0.0.0になる問題を回避）
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';

  const cookieStore = await cookies();

  // クッキーを保存するための配列
  const cookiesToStore: { name: string; value: string; options: CookieOptions }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToStore.push(...cookiesToSet);
        },
      },
    },
  );

  let success = false;

  // PKCE flow: codeパラメータでセッションを交換
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      success = true;
    }
  }

  // Token hash flow: token_hashとtypeでOTPを検証
  if (!success && tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      success = true;
    }
  }

  const redirectTo = success ? `${origin}${next}` : `${origin}/login?error=auth_callback_error`;

  // レスポンスを作成
  const response = NextResponse.redirect(redirectTo);

  // クッキーをレスポンスにセット
  for (const { name, value, options } of cookiesToStore) {
    response.cookies.set(name, value, options);
  }

  return response;
}
