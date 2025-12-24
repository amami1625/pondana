import { ListDetail } from '@/schemas/list';
import { createTestUuid } from '@/test/helpers';

/**
 * テスト用のListDetailオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns ListDetail型のモックオブジェクト
 */
export const createMockList = (overrides?: Partial<ListDetail>): ListDetail => ({
  id: createTestUuid(1),
  name: 'テストリスト',
  description: 'テスト説明',
  user_id: 1,
  public: true,
  books_count: 0,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  books: [],
  list_books: [],
  user: {
    id: 1,
    name: 'テストユーザー',
  },
  ...overrides,
});
