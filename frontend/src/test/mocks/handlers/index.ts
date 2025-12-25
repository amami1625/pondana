import { booksHandlers } from './books';
import { usersHandlers } from './users';

/**
 * MSW リクエストハンドラー
 * テストで使用するAPIモックを定義します
 */
export const handlers = [
  ...usersHandlers,
  ...booksHandlers,
  // 他のハンドラーをここに追加
];
