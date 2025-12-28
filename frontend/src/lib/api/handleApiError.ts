/**
 * API エラーレスポンスの型定義
 */
interface ApiErrorResponse {
  code?: string;
  error?: string;
}

/**
 * エラーメッセージの型定義
 * 各ドメインで定義されるエラーメッセージオブジェクトの型
 */
export interface ErrorMessages {
  NOT_FOUND: string;
  NETWORK_ERROR: string;
  UNKNOWN_ERROR: string;
  [key: string]: string;
}

/**
 * API エラーレスポンスを処理し、適切なエラーをスローする
 *
 * @param response - fetch API のレスポンスオブジェクト
 * @param errorMessages - ドメイン固有のエラーメッセージオブジェクト
 * @param domainName - ドメイン名（ログ出力用）例: 'Tags', 'Books'
 * @throws {Error} エラーメッセージを含む Error オブジェクト
 */
export async function handleApiError(
  response: Response,
  errorMessages: ErrorMessages,
  domainName: string,
): Promise<never> {
  const errorData: ApiErrorResponse = await response.json();

  // 開発環境でAPIエラーの詳細をログ出力
  if (process.env.NODE_ENV === 'development') {
    console.error(`${domainName} API Error:`, {
      status: response.status,
      data: errorData,
    });
  }

  // エラーコードがある場合はマッピング（最優先）
  if (errorData.code && errorData.code in errorMessages) {
    throw new Error(errorMessages[errorData.code]);
  }

  // 404は明確に区別（エラーコードがない場合のフォールバック）
  if (response.status === 404) {
    throw new Error(errorMessages.NOT_FOUND);
  }

  // それ以外はUNKNOWN_ERROR
  throw new Error(errorMessages.UNKNOWN_ERROR);
}

/**
 * ネットワークエラーを処理する
 *
 * @param error - キャッチされたエラー
 * @param errorMessages - ドメイン固有のエラーメッセージオブジェクト
 * @throws {Error} 適切なエラーメッセージを含む Error オブジェクト
 */
export function handleNetworkError(error: unknown, errorMessages: ErrorMessages): never {
  // ネットワークエラー（ブラウザ → Next.js API Route 間の通信失敗）
  // 例: オフライン、DNSエラー、接続タイムアウトなど
  if (error instanceof TypeError) {
    throw new Error(errorMessages.NETWORK_ERROR);
  }

  // 既に適切なエラーメッセージが設定されている場合はそのまま再throw
  throw error;
}
