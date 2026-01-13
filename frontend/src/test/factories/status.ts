import { Status } from '@/schemas/status';

/**
 * テスト用の Status オブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns Status 型のモックオブジェクト
 */
export const createMockStatus = (overrides?: Partial<Status>): Status => ({
  id: 1,
  name: 'テストステータス',
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});
