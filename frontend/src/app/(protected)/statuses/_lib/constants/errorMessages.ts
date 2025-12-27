/**
 * ステータス情報取得APIのエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const STATUSES_ERROR_MESSAGES = {
  NOT_FOUND: 'ステータスの取得に失敗しました',
  CREATE_FAILED: 'ステータスの作成に失敗しました',
  UPDATE_FAILED: 'ステータスの更新に失敗しました',
  DELETE_FAILED: 'ステータスの削除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type StatusesErrorCode = keyof typeof STATUSES_ERROR_MESSAGES;
