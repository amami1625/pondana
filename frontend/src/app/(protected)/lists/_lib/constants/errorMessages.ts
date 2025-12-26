/**
 * リスト情報取得APIのエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const LISTS_ERROR_MESSAGES = {
  NOT_FOUND: 'リストの取得に失敗しました',
  CREATE_FAILED: 'リストの作成に失敗しました',
  UPDATE_FAILED: 'リストの更新に失敗しました',
  DELETE_FAILED: 'リストの削除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type ListsErrorCode = keyof typeof LISTS_ERROR_MESSAGES;
