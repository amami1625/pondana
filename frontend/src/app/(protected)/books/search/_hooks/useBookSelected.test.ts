import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createMockGoogleBooksVolume } from '@/test/factories';
import { useBookSelected } from '@/app/(protected)/books/search/_hooks/useBookSelected';
import { useBooks } from '@/app/(protected)/books/_hooks/useBooks';
import { Book } from '@/schemas/book';

// useBookMutations をモック
const mockCreateBook = vi.fn();
const mockIsCreating = false;

vi.mock('@/app/(protected)/books/_hooks/useBookMutations', () => ({
  useBookMutations: () => ({
    createBook: mockCreateBook,
    isCreating: mockIsCreating,
  }),
}));

// useBooks をモック
vi.mock('@/app/(protected)/books/_hooks/useBooks');

beforeEach(() => {
  vi.mocked(useBooks).mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: true,
  } as unknown as ReturnType<typeof useBooks>);
});

describe('useBookSelected', () => {
  describe('registerBook', () => {
    it('GoogleBooksVolume を BookCreateData に変換して createBook を呼び出す', () => {
      const mockGoogleBook = createMockGoogleBooksVolume({
        id: 'google-book-123',
        volumeInfo: {
          title: 'テスト本',
          subtitle: 'テストサブタイトル',
          authors: ['テスト著者1', 'テスト著者2'],
          publishedDate: '2024-01-01',
          industryIdentifiers: [{ type: 'ISBN_13', identifier: '9784873117836' }],
          imageLinks: {
            thumbnail: 'http://example.com/thumbnail.jpg',
          },
        },
      });

      const { result } = renderHook(() => useBookSelected());

      act(() => {
        result.current.registerBook(mockGoogleBook);
      });

      // createBook が正しい形式で呼ばれることを確認
      expect(mockCreateBook).toHaveBeenCalledWith({
        google_books_id: 'google-book-123',
        isbn: '9784873117836',
        title: 'テスト本',
        subtitle: 'テストサブタイトル',
        thumbnail: 'http://example.com/thumbnail.jpg',
        authors: ['テスト著者1', 'テスト著者2'],
        description: undefined,
        category_id: undefined,
        tag_ids: [],
        rating: undefined,
        reading_status: 'unread',
        public: false,
      });
    });

    it('ISBN がない場合は undefined になる', () => {
      const mockGoogleBook = createMockGoogleBooksVolume({
        id: 'google-book-no-isbn',
        volumeInfo: {
          title: 'ISBN なしの本',
          industryIdentifiers: [],
        },
      });

      const { result } = renderHook(() => useBookSelected());

      act(() => {
        result.current.registerBook(mockGoogleBook);
      });

      expect(mockCreateBook).toHaveBeenCalledWith(
        expect.objectContaining({
          isbn: undefined,
        }),
      );
    });

    it('subtitle がない場合は undefined になる', () => {
      const mockGoogleBook = createMockGoogleBooksVolume({
        id: 'google-book-no-subtitle',
        volumeInfo: {
          title: 'サブタイトルなしの本',
          subtitle: undefined,
        },
      });

      const { result } = renderHook(() => useBookSelected());

      act(() => {
        result.current.registerBook(mockGoogleBook);
      });

      expect(mockCreateBook).toHaveBeenCalledWith(
        expect.objectContaining({
          subtitle: undefined,
        }),
      );
    });

    it('thumbnail がない場合は undefined になる', () => {
      const mockGoogleBook = createMockGoogleBooksVolume({
        id: 'google-book-no-thumbnail',
        volumeInfo: {
          title: 'サムネイルなしの本',
          imageLinks: undefined,
        },
      });

      const { result } = renderHook(() => useBookSelected());

      act(() => {
        result.current.registerBook(mockGoogleBook);
      });

      expect(mockCreateBook).toHaveBeenCalledWith(
        expect.objectContaining({
          thumbnail: undefined,
        }),
      );
    });

    it('authors がない場合は空配列になる', () => {
      const mockGoogleBook = createMockGoogleBooksVolume({
        id: 'google-book-no-authors',
        volumeInfo: {
          title: '著者なしの本',
          authors: undefined,
        },
      });

      const { result } = renderHook(() => useBookSelected());

      act(() => {
        result.current.registerBook(mockGoogleBook);
      });

      expect(mockCreateBook).toHaveBeenCalledWith(
        expect.objectContaining({
          authors: [],
        }),
      );
    });

    it('デフォルト値が正しく設定される', () => {
      const mockGoogleBook = createMockGoogleBooksVolume({
        id: 'google-book-default',
        volumeInfo: {
          title: 'デフォルト値テスト',
        },
      });

      const { result } = renderHook(() => useBookSelected());

      act(() => {
        result.current.registerBook(mockGoogleBook);
      });

      expect(mockCreateBook).toHaveBeenCalledWith(
        expect.objectContaining({
          description: undefined,
          category_id: undefined,
          tag_ids: [],
          rating: undefined,
          reading_status: 'unread',
          public: false,
        }),
      );
    });
  });

  describe('isRegistering', () => {
    it('useBookMutations の isCreating を返す', () => {
      const { result } = renderHook(() => useBookSelected());

      expect(result.current.isRegistering).toBe(mockIsCreating);
    });
  });

  describe('isAlreadyRegistered', () => {
    it('登録済みの本の場合 true を返す', () => {
      vi.mocked(useBooks).mockReturnValue({
        data: [{ id: '1', google_books_id: 'google-book-123', title: 'Test Book' }] as Book[],
        isLoading: false,
      } as ReturnType<typeof useBooks>);

      const { result } = renderHook(() => useBookSelected());

      expect(result.current.isAlreadyRegistered('google-book-123')).toBe(true);
    });

    it('未登録の本の場合 false を返す', () => {
      vi.mocked(useBooks).mockReturnValue({
        data: [{ id: '1', google_books_id: 'google-book-123', title: 'Test Book' }] as Book[],
        isLoading: false,
      } as ReturnType<typeof useBooks>);

      const { result } = renderHook(() => useBookSelected());

      expect(result.current.isAlreadyRegistered('google-book-999')).toBe(false);
    });

    it('books が undefined の場合 false を返す', () => {
      vi.mocked(useBooks).mockReturnValue({
        data: undefined,
        isLoading: false,
      } as ReturnType<typeof useBooks>);

      const { result } = renderHook(() => useBookSelected());

      expect(result.current.isAlreadyRegistered('google-book-123')).toBe(false);
    });
  });
});
