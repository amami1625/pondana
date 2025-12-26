/**
 * 本情報取得APIのエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const CATEGORIES_ERROR_MESSAGES = {
  NOT_FOUND: 'カテゴリの取得に失敗しました',
  CREATE_FAILED: 'カテゴリの作成に失敗しました',
  UPDATE_FAILED: 'カテゴリの更新に失敗しました',
  DELETE_FAILED: 'カテゴリの削除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type CategoriesErrorCode = keyof typeof CATEGORIES_ERROR_MESSAGES;
