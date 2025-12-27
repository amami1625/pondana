/**
 * 本情報取得APIのエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const TAGS_ERROR_MESSAGES = {
  NOT_FOUND: 'タグの取得に失敗しました',
  CREATE_FAILED: 'タグの作成に失敗しました',
  UPDATE_FAILED: 'タグの更新に失敗しました',
  DELETE_FAILED: 'タグの削除に失敗しました',
  ADD_FAILED: 'リストへの追加に失敗しました',
  REMOVE_FAILED: 'リストからの削除に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type TagsErrorCode = keyof typeof TAGS_ERROR_MESSAGES;
