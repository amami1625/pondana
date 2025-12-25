import { Card, CardFormData, cardSchema } from '@/app/(protected)/cards/_types';
import { CARDS_ERROR_MESSAGES, CardsErrorCode } from '../constants/errorMessages';

interface ApiErrorResponse {
  code?: string;
  error?: string;
}

// 更新用の型
type UpdateCardData = CardFormData & { id: string };

export async function updateCard(data: UpdateCardData): Promise<Card> {
  try {
    const response = await fetch(`/api/books/${data.book_id}/cards/${data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();

      // 開発環境でAPIエラーの詳細をログ出力
      if (process.env.NODE_ENV === 'development') {
        console.error('Cards API Error:', {
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

    const res = await response.json();
    return cardSchema.parse(res);
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
