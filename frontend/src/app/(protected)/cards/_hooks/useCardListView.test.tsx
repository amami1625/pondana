import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createMockStatus } from '@/test/factories/status';
import { createMockCard } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { CardList } from '../_types';
import { useStatuses } from '@/app/(protected)/statuses/_hooks/useStatuses';
import { useCardListView } from './useCardListView';

// useStatuses フックをモック
vi.mock('@/app/(protected)/statuses/_hooks/useStatuses');

// モックデータ
const mockStatuses = [
  createMockStatus({ id: 1, name: '勉強中' }),
  createMockStatus({ id: 2, name: '解決済み' }),
];

const cardList: CardList = {
  books: [
    {
      book: {
        id: createTestUuid(1),
        title: 'テストブックA',
      },
      cards: [
        createMockCard({
          id: createTestUuid(1),
          title: 'テストカード',
          content: 'テスト本文',
          book_id: createTestUuid(1),
          status: createMockStatus({ id: 1, name: '勉強中' }),
        }),
      ],
    },
    {
      book: {
        id: createTestUuid(2),
        title: 'テストブックB',
      },
      cards: [
        createMockCard({
          id: createTestUuid(2),
          title: 'テストカード',
          content: 'テスト本文',
          book_id: createTestUuid(2),
          status: createMockStatus({ id: 2, name: '解決済み' }),
        }),
      ],
    },
  ],
};

describe('useCardListView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('selectedStatus が null であること', () => {
      vi.mocked(useStatuses).mockReturnValue({
        data: mockStatuses,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      } as unknown as ReturnType<typeof useStatuses>);

      const { result } = renderHook(() => useCardListView(cardList));

      expect(result.current.selectedStatus).toBeNull();
    });
  });

  describe('ステータス一覧の取得', () => {
    it('ユーザーが作成したステータスから重複なしでソートされた配列を返す', () => {
      vi.mocked(useStatuses).mockReturnValue({
        data: mockStatuses,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      } as unknown as ReturnType<typeof useStatuses>);

      const { result } = renderHook(() => useCardListView(cardList));

      expect(result.current.statuses).toEqual(['勉強中', '解決済み']);
    });

    it('ステータスがない場合、空配列を返す', () => {
      vi.mocked(useStatuses).mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      } as unknown as ReturnType<typeof useStatuses>);

      const { result } = renderHook(() => useCardListView(cardList));

      expect(result.current.statuses).toEqual([]);
    });
  });

  describe('フィルタリング', () => {
    beforeEach(() => {
      vi.mocked(useStatuses).mockReturnValue({
        data: mockStatuses,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      } as unknown as ReturnType<typeof useStatuses>);
    });

    it('初期状態では全てのカードと書籍を返す', () => {
      const { result } = renderHook(() => useCardListView(cardList));

      expect(result.current.filteredCards).toHaveLength(2);
    });

    it('ステータスを選択すると、そのステータスのカードと書籍のみ返す', () => {
      const { result } = renderHook(() => useCardListView(cardList));

      act(() => {
        result.current.setSelectedStatus('勉強中');
      });

      expect(result.current.filteredCards).toHaveLength(1);
      expect(result.current.filteredCards[0].cards[0].status?.name).toBe('勉強中');
    });

    it('選択したステータスのカードがない場合、空配列を返す', () => {
      const { result } = renderHook(() => useCardListView(cardList));

      act(() => {
        result.current.setSelectedStatus('要復習');
      });

      expect(result.current.filteredCards).toEqual([]);
    });

    it('ステータス選択を解除すると、全てのカードと書籍を返す', () => {
      const { result } = renderHook(() => useCardListView(cardList));

      act(() => {
        result.current.setSelectedStatus('勉強中');
      });
      expect(result.current.filteredCards).toHaveLength(1);

      act(() => {
        result.current.setSelectedStatus(null);
      });
      expect(result.current.filteredCards).toHaveLength(2);
    });
  });

  describe('useMemo の依存配列の動作確認', () => {
    beforeEach(() => {
      vi.mocked(useStatuses).mockReturnValue({
        data: mockStatuses,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      } as unknown as ReturnType<typeof useStatuses>);
    });

    it('カードが変更されると、filteredCards が再計算される', () => {
      const initialCardList: CardList = {
        books: [
          {
            book: {
              id: createTestUuid(1),
              title: 'テストブックA',
            },
            cards: [
              createMockCard({
                id: createTestUuid(1),
                title: 'テストカード',
                content: 'テスト本文',
                book_id: createTestUuid(1),
                status: createMockStatus({ id: 1, name: '勉強中' }),
              }),
            ],
          },
        ],
      };

      const { result, rerender } = renderHook(({ cardList }) => useCardListView(cardList), {
        initialProps: { cardList: initialCardList },
      });

      expect(result.current.filteredCards).toHaveLength(1);

      rerender({ cardList });

      expect(result.current.filteredCards).toHaveLength(2);
    });

    it('ステータスが変更されると、statuses が再計算される', () => {
      const { result, rerender } = renderHook(() => useCardListView(cardList));

      expect(result.current.statuses).toEqual(['勉強中', '解決済み']);

      const newMockStatuses = [
        createMockStatus({ id: 1, name: '勉強中' }),
        createMockStatus({ id: 2, name: '解決済み' }),
        createMockStatus({ id: 3, name: '要復習' }),
      ];

      vi.mocked(useStatuses).mockReturnValue({
        data: newMockStatuses,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      } as unknown as ReturnType<typeof useStatuses>);

      rerender();

      expect(result.current.statuses).toEqual(['勉強中', '要復習', '解決済み']);
    });
  });
});
