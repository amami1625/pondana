import 'server-only';
import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/supabase/clients/server';
import { ApiError } from '@/lib/errors/ApiError';

/**
 * セッションを検証し、認証済みユーザーの情報を取得する
 * 
 * この関数はキャッシュされており、同じリクエスト内では結果が再利用される。
 * 認証されていない場合は自動的にログインページにリダイレクトする。
 * 
 * @returns ユーザー情報とセッション情報を含むオブジェクト
 * @throws {Error} ログインページへのリダイレクト（未認証時）
 */
export const verifySession = cache(async () => {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { user, session };
});

/**
 * 認証付きでバックエンドAPIにリクエストを送信する
 * 
 * この関数は以下の処理を自動的に行う：
 * - セッション検証とアクセストークンの取得
 * - 認証ヘッダー（Authorization）の付与
 * - エラーレスポンスの正規化とApiErrorへの変換
 * - 404エラー時の専用ページ表示
 * 
 * @param endpoint - APIエンドポイントのパス（例: "/users/1/follow"）
 *                   完全なURLを指定することも可能（例: "https://example.com/api/test"）
 * @param options - fetchのオプション（method, body, headersなど）
 * @returns APIからのレスポンスデータ（JSON）、またはundefined
 * @throws {ApiError} APIエラー時（ステータスコード、エラーコード、メッセージを含む）
 * @throws {Error} セッションが無効な場合
 * 
 * @example
 * // GETリクエスト
 * const users = await authenticatedRequest('/users');
 * 
 * @example
 * // POSTリクエスト
 * const result = await authenticatedRequest('/users/1/follow', {
 *   method: 'POST',
 *   body: JSON.stringify({ data: '...' })
 * });
 */
export async function authenticatedRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<unknown> {
  const { session } = await verifySession();

  if (!session?.access_token) {
    throw new Error('ログインが必要です');
  }

  const baseUrl = process.env.API_BASE_URL;
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session.access_token}`,
    ...(options.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // エラーメッセージの正規化（配列の場合は結合、文字列の場合はそのまま）
    let errorMessage = 'リクエストに失敗しました';
    if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.error) {
      errorMessage = Array.isArray(errorData.error) ? errorData.error.join(', ') : errorData.error;
    }

    throw new ApiError(errorMessage, response.status, errorData.code);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return undefined;
}
