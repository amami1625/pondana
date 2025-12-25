/**
 * 本情報取得APIのエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const BOOKS_ERROR_MESSAGES = {
  NOT_FOUND: '本の取得に失敗しました',
  CREATE_FAILED: '本の作成に失敗しました',
  UPDATE_FAILED: '本の更新に失敗しました',
  DELETE_FAILED: '本の削除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type BooksErrorCode = keyof typeof BOOKS_ERROR_MESSAGES;
