import { cardListSchema, type CardList } from '@/app/(protected)/cards/_types';
import { CARDS_ERROR_MESSAGES, CardsErrorCode } from '../constants/errorMessages';

interface ApiErrorResponse {
  code?: string;
  error?: string;
}

/**
 * カード一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchCards(): Promise<CardList> {
  try {
    const response = await fetch('/api/cards');

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();

      // 開発環境でAPIエラーの詳細をログ出力
      if (process.env.NODE_ENV === 'development') {
        console.error('Books API Error:', {
          status: response.status,
          data: errorData,
        });
      }

      // 404は明確に区別
      if (response.status === 404) {
        throw new Error(CARDS_ERROR_MESSAGES.NOT_FOUND);
      }

      // エラーコードがある場合はマッピング
      if (errorData.code && errorData.code in CARDS_ERROR_MESSAGES) {
        throw new Error(CARDS_ERROR_MESSAGES[errorData.code as CardsErrorCode]);
      }

      // それ以外はUNKNOWN_ERROR
      throw new Error(CARDS_ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    const data = await response.json();
    return cardListSchema.parse(data);
  } catch (error) {
    // ネットワークエラー（ブラウザ → Next.js API Route 間の通信失敗）
    // 例: オフライン、DNSエラー、接続タイムアウトなど
    if (error instanceof TypeError) {
      throw new Error(CARDS_ERROR_MESSAGES.NETWORK_ERROR);
    }

    // 既に適切なエラーメッセージが設定されている場合（try ブロックで throw したもの）
    // または予期しないエラーの場合はそのまま再throw
    throw error;
  }
}
