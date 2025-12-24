import { usersHandlers } from './handlers/users';

/**
 * MSW リクエストハンドラー
 * テストで使用するAPIモックを定義します
 */
export const handlers = [
  ...usersHandlers,
  // 他のハンドラーをここに追加
];
