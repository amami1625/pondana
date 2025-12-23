import { FOLLOW_ERROR_MESSAGES, type FollowErrorCode } from '../constants/errorMessages';
import { User, userSchema } from '@/app/(protected)/users/_types';

interface ApiErrorResponse {
  code?: string;
  error?: string;
}

export async function fetchFollowers(userId: string): Promise<User[]> {
  try {
    const response = await fetch(`/api/users/${userId}/followers`);

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();

      // 開発環境でAPIエラーの詳細をログ出力
      if (process.env.NODE_ENV === 'development') {
        console.error('Follow API Error:', {
          status: response.status,
          data: errorData,
        });
      }

      // エラーコードがある場合はマッピング
      if (errorData.code && errorData.code in FOLLOW_ERROR_MESSAGES) {
        throw new Error(FOLLOW_ERROR_MESSAGES[errorData.code as FollowErrorCode]);
      }

      // エラーコードが無い場合はデフォルトのエラーメッセージ
      throw new Error(FOLLOW_ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    const data = await response.json();
    return userSchema.array().parse(data);
  } catch (error) {
    // ネットワークエラー（ブラウザ → Next.js API Route 間の通信失敗）
    // 例: オフライン、DNSエラー、接続タイムアウトなど
    if (error instanceof TypeError) {
      throw new Error(FOLLOW_ERROR_MESSAGES.NETWORK_ERROR);
    }

    // 既に適切なエラーメッセージが設定されている場合（try ブロックで throw したもの）
    // または予期しないエラーの場合はそのまま再throw
    throw error;
  }
}
