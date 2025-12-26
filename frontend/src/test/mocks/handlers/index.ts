import { booksHandlers } from './books';
import { cardsHandlers } from './cards';
import { categoryHandlers } from './category';
import { listsHandlers } from './lists';
import { usersHandlers } from './users';

/**
 * MSW リクエストハンドラー
 * テストで使用するAPIモックを定義します
 */
export const handlers = [
  ...usersHandlers,
  ...booksHandlers,
  ...cardsHandlers,
  ...categoryHandlers,
  ...listsHandlers,
  // 他のハンドラーをここに追加
];
