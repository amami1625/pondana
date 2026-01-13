import { Tag } from '@/schemas/tag';

/**
 * テスト用の Tag オブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns Tag 型のモックオブジェクト
 */
export const createMockTag = (overrides?: Partial<Tag>): Tag => ({
  id: 1,
  name: 'テストタグ',
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});
