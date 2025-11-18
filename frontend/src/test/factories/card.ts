import { CardDetail } from '@/schemas/card';

/**
 * テスト用のCardDetailオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns CardDetail型のモックオブジェクト
 */
export const createMockCard = (overrides?: Partial<CardDetail>): CardDetail => ({
  id: 1,
  title: 'テストカード',
  content: 'テスト本文',
  book_id: 1,
  created_at: '2025-01-01',
  updated_at: '2025-01-01',
  book: {
    title: 'テスト本',
  },
  ...overrides,
});
