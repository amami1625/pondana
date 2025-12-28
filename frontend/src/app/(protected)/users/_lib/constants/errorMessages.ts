/**
 * ユーザー情報取得APIのエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const USERS_ERROR_MESSAGES = {
  NOT_FOUND: 'ユーザー情報の取得に失敗しました',
  FETCH_USER_BOOKS_FAILED: 'ユーザーの公開本一覧の取得に失敗しました',
  FETCH_USER_LISTS_FAILED: 'ユーザーの公開リスト一覧の取得に失敗しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type UsersErrorCode = keyof typeof USERS_ERROR_MESSAGES;

/**
 * フォロー機能のエラーメッセージ定義
 * APIから返されるエラーコードをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const FOLLOW_ERROR_MESSAGES = {
  NOT_FOUND: 'ユーザーが見つかりませんでした',
  FOLLOW_SELF_ERROR: '自分自身をフォローすることはできません',
  ALREADY_FOLLOWING: 'すでにこのユーザーをフォローしています',
  NOT_FOLLOWING: 'このユーザーをフォローしていません',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type FollowErrorCode = keyof typeof FOLLOW_ERROR_MESSAGES;
