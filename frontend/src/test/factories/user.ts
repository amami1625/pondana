import { User } from '@/schemas/user';

/**
 * テスト用のUserオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns User型のモックオブジェクト
 */
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 1,
  supabase_uid: '1',
  name: 'テストユーザー',
  avatar_url: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});
