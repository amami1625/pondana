import { bookDetailSchema, type BookDetail } from '@/app/(protected)/books/_types';
import { BOOKS_ERROR_MESSAGES, BooksErrorCode } from '../constants/errorMessages';

interface ApiErrorResponse {
  code?: string;
  error?: string;
}

/**
 * 書籍詳細を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchBook(id: string): Promise<BookDetail> {
  try {
    const response = await fetch(`/api/books/${id}`);

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
        throw new Error(BOOKS_ERROR_MESSAGES.NOT_FOUND);
      }

      // エラーコードがある場合はマッピング
      if (errorData.code && errorData.code in BOOKS_ERROR_MESSAGES) {
        throw new Error(BOOKS_ERROR_MESSAGES[errorData.code as BooksErrorCode]);
      }

      // それ以外はUNKNOWN_ERROR
      throw new Error(BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    const data = await response.json();
    return bookDetailSchema.parse(data);
  } catch (error) {
    // ネットワークエラー（ブラウザ → Next.js API Route 間の通信失敗）
    // 例: オフライン、DNSエラー、接続タイムアウトなど
    if (error instanceof TypeError) {
      throw new Error(BOOKS_ERROR_MESSAGES.NETWORK_ERROR);
    }

    // 既に適切なエラーメッセージが設定されている場合（try ブロックで throw したもの）
    // または予期しないエラーの場合はそのまま再throw
    throw error;
  }
}
