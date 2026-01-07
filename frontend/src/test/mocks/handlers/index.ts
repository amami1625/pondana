import { booksHandlers } from './books';
import { cardsHandlers } from './cards';
import { categoryHandlers } from './category';
import { dashboardHandlers } from './dashboard';
import { listBooksHandlers } from './listBooks';
import { listsHandlers } from './lists';
import { profileHandlers } from './profile';
import { statusesHandlers } from './statuses';
import { tagsHandlers } from './tags';
import { topHandlers } from './top';
import { usersHandlers } from './users';

/**
 * MSW リクエストハンドラー
 * テストで使用するAPIモックを定義します
 */
export const handlers = [
  ...topHandlers,
  ...usersHandlers,
  ...booksHandlers,
  ...cardsHandlers,
  ...categoryHandlers,
  ...listBooksHandlers,
  ...listsHandlers,
  ...profileHandlers,
  ...statusesHandlers,
  ...tagsHandlers,
  ...dashboardHandlers,
  // 他のハンドラーをここに追加
];
