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
  category_id: 1,
  rating: 5,
  reading_status: 'completed',
  public: true,
  created_at: '2025-01-01',
  updated_at: '2025-01-01',
  authors: [],
  lists: [],
  list_books: [],
  cards: [],
  ...overrides,
});
