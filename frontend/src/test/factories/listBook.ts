import { ListBook } from '@/schemas/listBooks';

/**
 * テスト用のListBookオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns ListBook型のモックオブジェクト
 */
export const createMockListBook = (overrides?: Partial<ListBook>): ListBook => ({
  id: 1,
  list_id: 1,
  book_id: 1,
  ...overrides,
});
