import { BookDetail } from '@/app/(protected)/books/_types';

/**
 * テスト用のBookDetailオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns BookDetail型のモックオブジェクト
 */
export const createMockBook = (overrides?: Partial<BookDetail>): BookDetail => ({
  id: 1,
  title: 'テスト本',
  description: 'テスト説明',
  user_id: 1,
  category: {
    id: 1,
    name: 'テストカテゴリ',
    user_id: 1,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  tags: [
    {
      id: 1,
      name: 'テストタグ1',
      user_id: 1,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'テストタグ2',
      user_id: 1,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  ],
  rating: 5,
  reading_status: 'completed',
  public: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  authors: [
    {
      id: 1,
      name: 'テスト著者',
      user_id: 1,
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  ],
  lists: [],
  list_books: [],
  cards: [],
  ...overrides,
});
