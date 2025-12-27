/**
 * プロフィール更新APIのエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const PROFILE_ERROR_MESSAGES = {
  NOT_FOUND: 'プロフィール情報の取得に失敗しました',
  UPDATE_FAILED: 'プロフィールの更新に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type ProfileErrorCode = keyof typeof PROFILE_ERROR_MESSAGES;
