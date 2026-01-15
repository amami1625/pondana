import { User, UserWithStats } from '@/schemas/user';

/**
 * テスト用のUserオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns User型のモックオブジェクト
 */
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  supabase_uid: '1',
  name: 'テストユーザー',
  avatar_url: null,
  avatar_public_id: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});

/**
 * テスト用のUserWithStatsオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns UserWithStats型のモックオブジェクト
 */
export const createMockUserWithStats = (overrides?: Partial<UserWithStats>): UserWithStats => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  supabase_uid: '1',
  name: 'テストユーザー',
  avatar_url: null,
  avatar_public_id: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  stats: {
    public_books: 5,
    public_lists: 2,
    following_count: 0,
    followers_count: 0,
  },
  ...overrides,
});
