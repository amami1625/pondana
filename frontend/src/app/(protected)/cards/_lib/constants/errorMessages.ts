/**
 * 本情報取得APIのエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const CARDS_ERROR_MESSAGES = {
  NOT_FOUND: 'カードの取得に失敗しました',
  CREATE_FAILED: 'カードの作成に失敗しました',
  UPDATE_FAILED: 'カードの更新に失敗しました',
  DELETE_FAILED: 'カードの削除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type CardsErrorCode = keyof typeof CARDS_ERROR_MESSAGES;
