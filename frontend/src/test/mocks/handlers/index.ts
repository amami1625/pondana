import { booksHandlers } from './books';
import { cardsHandlers } from './cards';
import { categoryHandlers } from './category';
import { listBooksHandlers } from './listBooks';
import { listsHandlers } from './lists';
import { statusesHandlers } from './statuses';
import { tagsHandlers } from './tags';
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
  ...listBooksHandlers,
  ...listsHandlers,
  ...statusesHandlers,
  ...tagsHandlers,
  // 他のハンドラーをここに追加
];
