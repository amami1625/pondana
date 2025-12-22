/**
 * フォロー機能のエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const FOLLOW_ERROR_MESSAGES = {
  FOLLOW_SELF_ERROR: '自分自身をフォローすることはできません',
  ALREADY_FOLLOWING: 'すでにこのユーザーをフォローしています',
  NOT_FOLLOWING: 'このユーザーをフォローしていません',
  USER_NOT_FOUND: 'ユーザーが見つかりませんでした',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type FollowErrorCode = keyof typeof FOLLOW_ERROR_MESSAGES;
