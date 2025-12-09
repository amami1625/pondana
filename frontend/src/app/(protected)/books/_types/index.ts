export {
  type BookBase,
  type Book,
  type BookDetail,
  type BookCreateData,
  type BookUpdateData,
  type AddedList,
  bookBaseSchema,
  bookSchema,
  bookDetailSchema,
  bookCreateSchema,
  bookUpdateSchema,
} from '@/schemas/book';

export type ReadingStatus = 'unread' | 'reading' | 'completed';

// Google Books API のレスポンス型定義
// 実際に使用しているプロパティのみを定義

export interface GoogleBooksVolume {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: Array<{
      type: 'ISBN_10' | 'ISBN_13';
      identifier: string;
    }>;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBooksVolume[];
}
