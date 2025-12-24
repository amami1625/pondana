/**
 * APIエラークラス
 * HTTPステータスコードとエラーコードを保持する
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';

    // TypeScriptでのprototypeチェーン維持のため
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
