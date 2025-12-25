import { booksHandlers } from './books';
import { cardsHandlers } from './cards';
import { usersHandlers } from './users';

/**
 * MSW リクエストハンドラー
 * テストで使用するAPIモックを定義します
 */
export const handlers = [
  ...usersHandlers,
  ...booksHandlers,
  ...cardsHandlers,
  // 他のハンドラーをここに追加
];
