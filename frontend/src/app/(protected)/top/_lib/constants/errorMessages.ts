/**
 * トップページデータ取得APIのエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const TOP_ERROR_MESSAGES = {
  NOT_FOUND: 'トップページデータの取得に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type TopErrorCode = keyof typeof TOP_ERROR_MESSAGES;
