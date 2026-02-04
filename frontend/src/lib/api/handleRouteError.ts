import { ApiError } from '@/lib/errors/ApiError';
import { NextResponse } from 'next/server';

type ErrorMessages = {
  apiError: string;
  networkError: string;
  unknown: string;
};

/**
 * API Route のエラーハンドリングを統一するヘルパー関数
 *
 * @param error - キャッチしたエラー
 * @param messages - エラーメッセージ（apiError, networkError, unknown）
 * @returns NextResponse（エラーレスポンス）
 */
export function handleRouteError(error: unknown, messages: ErrorMessages): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: messages.apiError }, { status: error.statusCode });
  }
  if (error instanceof TypeError) {
    return NextResponse.json({ error: messages.networkError }, { status: 503 });
  }
  return NextResponse.json({ error: messages.unknown }, { status: 500 });
}
