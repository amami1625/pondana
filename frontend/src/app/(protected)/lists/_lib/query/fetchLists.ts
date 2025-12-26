import { listSchema, type List } from '@/app/(protected)/lists/_types';
import { LISTS_ERROR_MESSAGES, ListsErrorCode } from '../constants/errorMessages';

interface ApiErrorResponse {
  code?: string;
  error?: string;
}

/**
 * リスト一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchLists(): Promise<List[]> {
  try {
    const response = await fetch('/api/lists');

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();

      // 開発環境でAPIエラーの詳細をログ出力
      if (process.env.NODE_ENV === 'development') {
        console.error('Lists API Error:', {
          status: response.status,
          data: errorData,
        });
      }

      // 404は明確に区別
      if (response.status === 404) {
        throw new Error(LISTS_ERROR_MESSAGES.NOT_FOUND);
      }

      // エラーコードがある場合はマッピング
      if (errorData.code && errorData.code in LISTS_ERROR_MESSAGES) {
        throw new Error(LISTS_ERROR_MESSAGES[errorData.code as ListsErrorCode]);
      }

      // それ以外はUNKNOWN_ERROR
      throw new Error(LISTS_ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    const data = await response.json();
    return listSchema.array().parse(data);
  } catch (error) {
    // ネットワークエラー（ブラウザ → Next.js API Route 間の通信失敗）
    // 例: オフライン、DNSエラー、接続タイムアウトなど
    if (error instanceof TypeError) {
      throw new Error(LISTS_ERROR_MESSAGES.NETWORK_ERROR);
    }

    // 既に適切なエラーメッセージが設定されている場合（try ブロックで throw したもの）
    // または予期しないエラーの場合はそのまま再throw
    throw error;
  }
}
