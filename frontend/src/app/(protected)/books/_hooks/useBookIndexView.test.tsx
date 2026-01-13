import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookIndexView } from './useBookIndexView';
import { createTestUuid } from '@/test/helpers';
import { useCategories } from '@/app/(protected)/categories/_hooks/useCategories';
import { createMockBook, createMockCategory } from '@/test/factories';

// useCategories フックをモック
vi.mock('@/app/(protected)/categories/_hooks/useCategories');

// モックデータ
const mockCategories = [
  createMockCategory({
    id: 1,
    name: 'プログラミング',
  }),
  createMockCategory({
    id: 2,
    name: 'インフラ',
  }),
];

const mockBooks = [
  createMockBook({
    id: createTestUuid(1),
    category: createMockCategory({
      id: 1,
      name: 'プログラミング',
    }),
  }),
  createMockBook({
    id: createTestUuid(2),
    category: createMockCategory({
      id: 2,
      name: 'インフラ',
    }),
  }),
];

describe('useBookIndexView', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCategories).mockReturnValue({
      data: mockCategories,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    } as unknown as ReturnType<typeof useCategories>);
  });

  describe('初期状態', () => {
    it('selectedCategory が null であること', () => {
      const { result } = renderHook(() => useBookIndexView([]));

      expect(result.current.selectedCategory).toBeNull();
    });
  });

  describe('カテゴリ一覧の取得', () => {
    it('ユーザーが作成したカテゴリから重複なしでソートされた配列を返す', async () => {
      const { result } = renderHook(() => useBookIndexView([]));

      expect(result.current.categories).toEqual(['インフラ', 'プログラミング']);
    });
  });

  describe('フィルタリング', () => {
    it('初期状態では全ての書籍を返す', () => {
      const { result } = renderHook(() => useBookIndexView(mockBooks));

      expect(result.current.filteredBooks).toHaveLength(2);
    });

    it('カテゴリを選択すると、そのカテゴリの書籍のみを返す', () => {
      const { result } = renderHook(() => useBookIndexView(mockBooks));

      act(() => {
        result.current.setSelectedCategory('プログラミング');
      });

      expect(result.current.filteredBooks).toHaveLength(1);
      expect(result.current.filteredBooks[0].category?.name).toBe('プログラミング');

      act(() => {
        result.current.setSelectedCategory('インフラ');
      });

      expect(result.current.filteredBooks).toHaveLength(1);
      expect(result.current.filteredBooks[0].category?.name).toBe('インフラ');
    });

    it('選択したカテゴリの書籍がない場合、空配列を返す', () => {
      const { result } = renderHook(() => useBookIndexView(mockBooks));

      act(() => {
        result.current.setSelectedCategory('データベース');
      });

      expect(result.current.filteredBooks).toHaveLength(0);
    });

    it('カテゴリ選択を解除すると、全ての書籍を返す', () => {
      const { result } = renderHook(() => useBookIndexView(mockBooks));

      act(() => {
        result.current.setSelectedCategory('プログラミング');
      });
      expect(result.current.filteredBooks).toHaveLength(1);

      act(() => {
        result.current.setSelectedCategory(null);
      });
      expect(result.current.filteredBooks).toHaveLength(2);
    });
  });

  describe('useMemo の依存配列の動作確認', () => {
    it('書籍データが変更されると、filteredBooksが再計算される', async () => {
      const initialBooks = [
        createMockBook({
          id: createTestUuid(1),
          category: {
            id: 1,
            name: 'プログラミング',
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            created_at: '',
            updated_at: '',
          },
        }),
      ];

      const { result, rerender } = renderHook(({ books }) => useBookIndexView(books), {
        initialProps: { books: initialBooks },
      });

      expect(result.current.filteredBooks).toHaveLength(1);

      rerender({ books: mockBooks });

      expect(result.current.filteredBooks).toHaveLength(2);
    });

    it('カテゴリデータが変更されると、categoriesが再計算される', async () => {
      const { result, rerender } = renderHook(() => useBookIndexView(mockBooks));

      expect(result.current.categories).toEqual(['インフラ', 'プログラミング']);

      const newMockCategories = [
        {
          id: 1,
          name: 'プログラミング',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          created_at: '',
          updated_at: '',
        },
        {
          id: 2,
          name: 'インフラ',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          created_at: '',
          updated_at: '',
        },
        {
          id: 3,
          name: 'DB',
          user_id: '550e8400-e29b-41d4-a716-446655440000',
          created_at: '',
          updated_at: '',
        },
      ];

      vi.mocked(useCategories).mockReturnValue({
        data: newMockCategories,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      } as unknown as ReturnType<typeof useCategories>);

      rerender();

      expect(result.current.categories).toEqual(['DB', 'インフラ', 'プログラミング']);
    });
  });
});
