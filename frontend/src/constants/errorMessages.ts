/**
 * アプリケーション全体のエラーメッセージ定義
 *
 * 各ドメインのエラーメッセージを一元管理します。
 * 共通エラーメッセージを使い回しつつ、ドメイン固有のメッセージも定義しています。
 */

import type { ErrorMessages } from '@/lib/api/handleApiError';

/**
 * 共通エラーメッセージ（全ドメインで共有）
 */
const NETWORK_ERROR = 'ネットワークエラーが発生しました';
const UNKNOWN_ERROR = 'エラーが発生しました。もう一度お試しください';

/**
 * Books ドメインのエラーメッセージ
 */
export const BOOKS_ERROR_MESSAGES = {
  NOT_FOUND: '本の取得に失敗しました',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  CREATE_FAILED: '本の作成に失敗しました',
  UPDATE_FAILED: '本の更新に失敗しました',
  DELETE_FAILED: '本の削除に失敗しました',
  ADD_FAILED: 'リストへの追加に失敗しました',
  REMOVE_FAILED: 'リストからの削除に失敗しました',
} as const satisfies ErrorMessages;

/**
 * Cards ドメインのエラーメッセージ
 */
export const CARDS_ERROR_MESSAGES = {
  NOT_FOUND: 'カードの取得に失敗しました',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  CREATE_FAILED: 'カードの作成に失敗しました',
  UPDATE_FAILED: 'カードの更新に失敗しました',
  DELETE_FAILED: 'カードの削除に失敗しました',
} as const satisfies ErrorMessages;

/**
 * Categories ドメインのエラーメッセージ
 */
export const CATEGORIES_ERROR_MESSAGES = {
  NOT_FOUND: 'カテゴリの取得に失敗しました',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  CREATE_FAILED: 'カテゴリの作成に失敗しました',
  UPDATE_FAILED: 'カテゴリの更新に失敗しました',
  DELETE_FAILED: 'カテゴリの削除に失敗しました',
  ALREADY_EXISTS: 'このカテゴリ名は既に使用されています',
} as const satisfies ErrorMessages;

/**
 * Lists ドメインのエラーメッセージ
 */
export const LISTS_ERROR_MESSAGES = {
  NOT_FOUND: 'リストの取得に失敗しました',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  CREATE_FAILED: 'リストの作成に失敗しました',
  UPDATE_FAILED: 'リストの更新に失敗しました',
  DELETE_FAILED: 'リストの削除に失敗しました',
  ALREADY_EXISTS: 'このリスト名は既に使用されています',
} as const satisfies ErrorMessages;

/**
 * ListBooks ドメインのエラーメッセージ
 */
export const LIST_BOOKS_ERROR_MESSAGES = {
  NOT_FOUND: 'リストまたは本が見つかりませんでした',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  ADD_FAILED: 'リストへの本の追加に失敗しました',
  REMOVE_FAILED: 'リストからの本の削除に失敗しました',
  ALREADY_EXISTS: 'この本は既にリストに追加されています',
} as const satisfies ErrorMessages;

/**
 * Statuses ドメインのエラーメッセージ
 */
export const STATUSES_ERROR_MESSAGES = {
  NOT_FOUND: 'ステータスの取得に失敗しました',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  CREATE_FAILED: 'ステータスの作成に失敗しました',
  UPDATE_FAILED: 'ステータスの更新に失敗しました',
  DELETE_FAILED: 'ステータスの削除に失敗しました',
  ALREADY_EXISTS: 'このステータス名は既に使用されています',
} as const satisfies ErrorMessages;

/**
 * Tags ドメインのエラーメッセージ
 */
export const TAGS_ERROR_MESSAGES = {
  NOT_FOUND: 'タグの取得に失敗しました',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  CREATE_FAILED: 'タグの作成に失敗しました',
  UPDATE_FAILED: 'タグの更新に失敗しました',
  DELETE_FAILED: 'タグの削除に失敗しました',
  ALREADY_EXISTS: 'このタグ名は既に使用されています',
} as const satisfies ErrorMessages;

/**
 * Users ドメインのエラーメッセージ
 */
export const USERS_ERROR_MESSAGES = {
  NOT_FOUND: 'ユーザー情報の取得に失敗しました',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  FETCH_USER_BOOKS_FAILED: 'ユーザーの公開本一覧の取得に失敗しました',
  FETCH_USER_LISTS_FAILED: 'ユーザーの公開リスト一覧の取得に失敗しました',
} as const satisfies ErrorMessages;

/**
 * Follow ドメインのエラーメッセージ
 */
export const FOLLOW_ERROR_MESSAGES = {
  NOT_FOUND: 'ユーザーが見つかりませんでした',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  FOLLOW_SELF_ERROR: '自分自身をフォローすることはできません',
  ALREADY_FOLLOWING: 'すでにこのユーザーをフォローしています',
  NOT_FOLLOWING: 'このユーザーをフォローしていません',
} as const satisfies ErrorMessages;

/**
 * Profile ドメインのエラーメッセージ
 */
export const PROFILE_ERROR_MESSAGES = {
  NOT_FOUND: 'プロフィール情報の取得に失敗しました',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
  UPDATE_FAILED: 'プロフィールの更新に失敗しました',
} as const satisfies ErrorMessages;

/**
 * Top ドメインのエラーメッセージ
 */
export const TOP_ERROR_MESSAGES = {
  NOT_FOUND: 'トップページデータの取得に失敗しました',
  NETWORK_ERROR,
  UNKNOWN_ERROR,
} as const satisfies ErrorMessages;
