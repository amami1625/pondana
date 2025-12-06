import { ListBook } from '@/schemas/listBooks';
import { createTestUuid } from '@/test/helpers';

/**
 * テスト用のListBookオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns ListBook型のモックオブジェクト
 */
export const createMockListBook = (overrides?: Partial<ListBook>): ListBook => ({
  id: 1,
  list_id: createTestUuid(1),
  book_id: createTestUuid(1),
  ...overrides,
});
