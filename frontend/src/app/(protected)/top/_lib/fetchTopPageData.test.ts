import { describe, it, expect } from 'vitest';
import { toJapaneseLocaleString, createTestUuid } from '@/test/helpers';
import { fetchTopPageData } from './fetchTopPageData';

describe('fetchTopPageData', () => {
  describe('成功時', () => {
    it('トップページデータを正しく取得できる', async () => {
      const result = await fetchTopPageData();

      expect(result).toHaveProperty('recent_books');
      expect(result).toHaveProperty('recent_lists');
      expect(result).toHaveProperty('recent_cards');
      expect(result.recent_books).toHaveLength(2);
      expect(result.recent_lists).toHaveLength(2);
      expect(result.recent_cards).toHaveLength(2);

      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      // 最初の本のデータを検証
      expect(result.recent_books[0]).toMatchObject({
        id: createTestUuid(1),
        title: '最近の本1',
        description: 'テスト説明',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        rating: 5,
        reading_status: 'completed',
        public: true,
        google_books_id: 'aaaaaaaaaa',
        isbn: '999999999',
        created_at: expectedDate,
        updated_at: expectedDate,
      });
      expect(result.recent_books[0]).toHaveProperty('category');
      expect(result.recent_books[0]).toHaveProperty('tags');

      // 最初のリストのデータを検証
      expect(result.recent_lists[0]).toEqual({
        id: createTestUuid(1),
        name: '最近のリスト1',
        description: 'テスト説明',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        public: true,
        books_count: 3,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      // 最初のカードのデータを検証
      expect(result.recent_cards[0]).toMatchObject({
        id: createTestUuid(1),
        title: '最近のカード1',
        book_id: createTestUuid(1),
        book: { title: '本のタイトル1' },
        created_at: expectedDate,
        updated_at: expectedDate,
      });
    });
  });
});
