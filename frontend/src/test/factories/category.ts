import { Category } from '@/schemas/category';

/**
 * テスト用のCategoryオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns Category型のモックオブジェクト
 */
export const createMockCategory = (overrides?: Partial<Category>): Category => ({
  id: 1,
  name: 'テストカテゴリー',
  user_id: 1,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});
