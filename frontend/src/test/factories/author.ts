import { Author } from '@/schemas/author';

/**
 * テスト用のAuthorオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns Author型のモックオブジェクト
 */
export const createMockAuthor = (overrides?: Partial<Author>): Author => ({
  id: 1,
  name: 'テスト著者',
  user_id: 1,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  ...overrides,
});
