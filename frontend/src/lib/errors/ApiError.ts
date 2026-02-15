/**
 * APIエラークラス
 * HTTPステータスコードを保持する
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'ApiError';

    // TypeScriptでのprototypeチェーン維持のため
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
