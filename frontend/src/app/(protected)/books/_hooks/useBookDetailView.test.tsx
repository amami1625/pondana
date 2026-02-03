import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { createMockBook, createMockCategory } from '@/test/factories';
import { mockUseBookMutations, mockUseModal } from '@/test/mocks';
import { useBookDetailView } from './useBookDetailView';
import { createMockTag } from '@/test/factories/tag';
import { createTestUuid } from '@/test/helpers';

// モックの設定
vi.mock('@/hooks/useModal');
vi.mock('@/app/(protected)/books/_hooks/useBookMutations');

describe('useBookDetailView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBookMutations();
    mockUseModal();
  });

  describe('handleDelete', () => {
    const mockDeleteBook = vi.fn();

    beforeEach(() => {
      mockUseBookMutations({ deleteBook: mockDeleteBook });
    });

    it('ユーザーが削除をキャンセルした場合、削除されない', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const book = createMockBook({ id: createTestUuid(1) });

      const { result } = renderHook(() => useBookDetailView(book));
      result.current.handleDelete(createTestUuid(1));

      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');
      expect(mockDeleteBook).not.toHaveBeenCalled();
    });

    it('ユーザーが削除を確認した場合、削除される', () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const book = createMockBook({ id: createTestUuid(1) });

      const { result } = renderHook(() => useBookDetailView(book));
      result.current.handleDelete(createTestUuid(1));

      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');
      expect(mockDeleteBook).toHaveBeenCalledWith({ id: createTestUuid(1) });
    });
  });

  describe('breadcrumbItems', () => {
    it('パンくずリストが正しく生成される', () => {
      const book = createMockBook({ title: 'テスト本' });

      const { result } = renderHook(() => useBookDetailView(book));

      expect(result.current.breadcrumbItems).toHaveLength(3);
      expect(result.current.breadcrumbItems[2].label).toBe('テスト本');
    });
  });

  describe('モーダル', () => {
    it('updateModal, addListModal, cardModal が返される', () => {
      const book = createMockBook();
      const { result } = renderHook(() => useBookDetailView(book));

      expect(result.current.updateModal).toBeDefined();
      expect(result.current.addListModal).toBeDefined();
      expect(result.current.cardModal).toBeDefined();
    });
  });

  describe('badges', () => {
    it('読書ステータスバッジが表示される', () => {
      const book = createMockBook({ reading_status: 'reading' });

      const { result } = renderHook(() => useBookDetailView(book));
      render(<div>{result.current.badges}</div>);

      expect(screen.getByText('読書中')).toBeInTheDocument();
    });

    it('カテゴリバッジが表示される', () => {
      const book = createMockBook({
        category: createMockCategory({ name: 'プログラミング' }),
      });

      const { result } = renderHook(() => useBookDetailView(book));
      render(<div>{result.current.badges}</div>);

      expect(screen.getByText('プログラミング')).toBeInTheDocument();
    });

    it('カテゴリがない場合、カテゴリバッジは表示されない', () => {
      const book = createMockBook({ category: undefined });

      const { result } = renderHook(() => useBookDetailView(book));
      render(<div>{result.current.badges}</div>);

      // カテゴリ名がないことを確認（他のバッジは存在する）
      expect(screen.queryByText('プログラミング')).not.toBeInTheDocument();
    });

    it('タグバッジが表示される', () => {
      const book = createMockBook({
        tags: [
          createMockTag({ name: 'TypeScript' }),
          createMockTag({ name: 'React' }),
        ],
      });

      const { result } = renderHook(() => useBookDetailView(book));
      render(<div>{result.current.badges}</div>);

      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('タグがない場合、タグバッジは表示されない', () => {
      const book = createMockBook({ tags: [] });

      const { result } = renderHook(() => useBookDetailView(book));
      render(<div>{result.current.badges}</div>);

      expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    });

    it('公開状態バッジが表示される（公開）', () => {
      const book = createMockBook({ public: true });

      const { result } = renderHook(() => useBookDetailView(book));
      render(<div>{result.current.badges}</div>);

      expect(screen.getByText('公開')).toBeInTheDocument();
    });

    it('公開状態バッジが表示される（非公開）', () => {
      const book = createMockBook({ public: false });

      const { result } = renderHook(() => useBookDetailView(book));
      render(<div>{result.current.badges}</div>);

      expect(screen.getByText('非公開')).toBeInTheDocument();
    });
  });
});
