import { CardDetail } from '@/schemas/card';
import { createTestUuid } from '@/test/helpers';

/**
 * テスト用のCardDetailオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns CardDetail型のモックオブジェクト
 */
export const createMockCard = (overrides?: Partial<CardDetail>): CardDetail => ({
  id: createTestUuid(1),
  title: 'テストカード',
  content: 'テスト本文',
  book_id: createTestUuid(1),
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  book: {
    title: 'テスト本',
  },
  ...overrides,
});
