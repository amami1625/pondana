import { LIST_BOOKS_ERROR_MESSAGES, ListBooksErrorCode } from '../constants/errorMessages';

interface ApiErrorResponse {
  code?: string;
  error?: string;
}

export async function removeListBook({ id }: { id: number }): Promise<void> {
  try {
    const response = await fetch(`/api/list_books/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();

      // 開発環境でAPIエラーの詳細をログ出力
      if (process.env.NODE_ENV === 'development') {
        console.error('ListBooks API Error:', {
          status: response.status,
          data: errorData,
        });
      }

      // 404は明確に区別
      if (response.status === 404) {
        throw new Error(LIST_BOOKS_ERROR_MESSAGES.NOT_FOUND);
      }

      // エラーコードがある場合はマッピング
      if (errorData.code && errorData.code in LIST_BOOKS_ERROR_MESSAGES) {
        throw new Error(LIST_BOOKS_ERROR_MESSAGES[errorData.code as ListBooksErrorCode]);
      }

      // それ以外はUNKNOWN_ERROR
      throw new Error(LIST_BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  } catch (error) {
    // ネットワークエラー（ブラウザ → Next.js API Route 間の通信失敗）
    // 例: オフライン、DNSエラー、接続タイムアウトなど
    if (error instanceof TypeError) {
      throw new Error(LIST_BOOKS_ERROR_MESSAGES.NETWORK_ERROR);
    }

    // 既に適切なエラーメッセージが設定されている場合（try ブロックで throw したもの）
    // または予期しないエラーの場合はそのまま再throw
    throw error;
  }
}
