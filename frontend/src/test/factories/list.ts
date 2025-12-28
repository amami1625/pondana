import { ListBase, ListDetail, List } from '@/schemas/list';
import { createTestUuid } from '@/test/helpers';

/**
 * テスト用のListBaseオブジェクトを作成するファクトリー関数
 * Rails APIのcreate/updateアクションのレスポンスに対応
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns ListBase型のモックオブジェクト
 */
export const createMockListBase = (overrides?: Partial<ListBase>): ListBase => ({
  id: createTestUuid(1),
  name: 'テストリスト',
  description: 'テスト説明',
  user_id: 1,
  public: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});

/**
 * テスト用のListオブジェクトを作成するファクトリー関数
 * Rails APIのindexアクションのレスポンスに対応（books_count含む）
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns List型のモックオブジェクト
 */
export const createMockListItem = (overrides?: Partial<List>): List => ({
  id: createTestUuid(1),
  name: 'テストリスト',
  description: 'テスト説明',
  user_id: 1,
  public: true,
  books_count: 0,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});

/**
 * テスト用のListDetailオブジェクトを作成するファクトリー関数
 * Rails APIのshowアクションのレスポンスに対応（books, list_books, user含む）
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
