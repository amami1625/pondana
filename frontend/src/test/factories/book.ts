import { BookDetail, GoogleBooksVolume } from '@/app/(protected)/books/_types';
import { createTestUuid } from '@/test/helpers';

/**
 * テスト用の BookDetail オブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns BookDetail 型のモックオブジェクト
 */
export const createMockBook = (overrides?: Partial<BookDetail>): BookDetail => ({
  id: createTestUuid(1),
  title: 'テスト本',
  description: 'テスト説明',
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  category: {
    id: 1,
    name: 'テストカテゴリ',
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  tags: [
    {
      id: 1,
      name: 'テストタグ1',
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'テストタグ2',
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
  ],
  google_books_id: 'aaaaaaaaaa',
  isbn: '999999999',
  subtitle: null,
  thumbnail: null,
  authors: [],
  lists: [],
  list_books: [],
  rating: 5,
  reading_status: 'completed',
  public: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
  cards: [],
  ...overrides,
});

/**
 * テスト用の GoogleBooksVolume オブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns GoogleBooksVolume 型のモックオブジェクト
 */

export const createMockGoogleBooksVolume = (overrides?: Partial<GoogleBooksVolume>) => ({
  id: 'test-book-id',
  volumeInfo: {
    title: 'テスト書籍',
    subtitle: 'サブタイトル',
    authors: ['テスト著者'],
    publishedDate: '2025-01-01',
    description: 'テスト用の説明',
    industryIdentifiers: [
      {
        type: 'ISBN_13' as const,
        identifier: '9784873117836',
      },
    ],
    imageLinks: {
      thumbnail: 'http://example.com/image.jpg',
    },
  },
  ...overrides,
});
