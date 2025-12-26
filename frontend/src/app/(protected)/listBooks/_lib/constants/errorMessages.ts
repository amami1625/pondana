/**
 * リストと本の関連（ListBooks）のエラーメッセージ定義
 * list_books APIのエラーをユーザーフレンドリーな日本語メッセージにマッピング
 */
export const LIST_BOOKS_ERROR_MESSAGES = {
  NOT_FOUND: 'リストまたは本が見つかりませんでした',
  ADD_FAILED: 'リストへの本の追加に失敗しました',
  REMOVE_FAILED: 'リストからの本の削除に失敗しました',
  ALREADY_EXISTS: 'この本は既にリストに追加されています',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  UNKNOWN_ERROR: 'エラーが発生しました。もう一度お試しください',
} as const;

export type ListBooksErrorCode = keyof typeof LIST_BOOKS_ERROR_MESSAGES;
