import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createMockBook, createMockAuthor, createMockCategory } from '@/test/factories';
import { mockUseBookMutations, mockUseModal } from '@/test/mocks';
import { useBookDetailView } from './useBookDetailView';
import { createMockTag } from '@/test/factories/tag';
import { createTestUuid } from '@/test/helpers';

// モックの設定
vi.mock('@/hooks/useModal');
vi.mock('@/app/(protected)/books/_hooks/useBookMutations');

describe('useBookDetailView', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('handleDelete', () => {
    // 削除関数の偽物を作成
    const mockDeleteBook = vi.fn();

    beforeEach(() => {
      // モックを設定（ヘルパー関数を使用）
      mockUseBookMutations({ deleteBook: mockDeleteBook });
      mockUseModal();
    });

    it('ユーザーが削除をキャンセルした場合、削除されない', () => {
      // 確認ダイアログを偽物にして、falseを返す
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const book = createMockBook({ id: createTestUuid(1) });

      const { result } = renderHook(() => useBookDetailView(book));

      // 削除を実行
      result.current.handleDelete(createTestUuid(1));

      // 確認ダイアログが表示されたことを確認
      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');

      // 削除関数は呼ばれていないことを確認（キャンセルしたから）
      expect(mockDeleteBook).not.toHaveBeenCalled();
    });

    it('ユーザーが削除をキャンセルしなかった場合、削除される', () => {
      // 確認ダイアログを偽物にして、trueを返す
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const book = createMockBook({ id: createTestUuid(1) });

      const { result } = renderHook(() => useBookDetailView(book));

      // 削除を実行
      result.current.handleDelete(createTestUuid(1));

      // 確認ダイアログが表示されたことを確認
      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');

      // 削除関数が正しい引数で呼ばれたことを確認
      expect(mockDeleteBook).toHaveBeenCalledWith(createTestUuid(1));
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

  describe('subtitle', () => {
    it('1人の著者の場合、著者名が表示される', () => {
      const book = createMockBook({
        authors: [createMockAuthor({ name: '著者A' })],
      });

      const { result } = renderHook(() => useBookDetailView(book));

      expect(result.current.subtitle).toBe('著者: 著者A');
    });

    it('複数の著者がいる場合、カンマ区切りで表示される', () => {
      const book = createMockBook({
        authors: [
          createMockAuthor({ id: 1, name: '著者A' }),
          createMockAuthor({ id: 2, name: '著者B' }),
          createMockAuthor({ id: 3, name: '著者C' }),
        ],
      });

      const { result } = renderHook(() => useBookDetailView(book));

      expect(result.current.subtitle).toBe('著者: 著者A, 著者B, 著者C');
    });
  });

  describe('モーダル', () => {
    it('updateModal, addListModal, cardModal が返される', () => {
      mockUseModal();

      const book = createMockBook();
      const { result } = renderHook(() => useBookDetailView(book));

      // 3つのモーダルが存在することを確認
      expect(result.current.updateModal).toBeDefined();
      expect(result.current.addListModal).toBeDefined();
      expect(result.current.cardModal).toBeDefined();
    });
  });

  describe('badges', () => {
    beforeEach(() => {
      mockUseBookMutations();
      mockUseModal();
    });

    it('badges が JSX 要素として定義されている', () => {
      const book = createMockBook();

      const { result } = renderHook(() => useBookDetailView(book));

      // badges が定義されていることを確認
      expect(result.current.badges).toBeDefined();
      // JSX 要素であることを確認
      expect(result.current.badges).toHaveProperty('type');
    });

    it('カテゴリ・タグがある場合、バッジが表示される', () => {
      const book = createMockBook({
        category: createMockCategory({ name: 'テストカテゴリ' }),
        tags: [createMockTag({ name: 'テストタグ' })],
      });

      const { result } = renderHook(() => useBookDetailView(book));

      // Fragment の props.children を確認
      const badges = result.current.badges as React.ReactElement<{ children: React.ReactNode[] }>;
      const children = badges.props.children;

      // 3つの子要素があることを確認（CategoryBadge, TagBadge, PublicBadge）
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(3);
      expect(children[0]).toBeDefined(); // CategoryBadge
      expect(children[1]).toBeDefined(); // TagBadge
      expect(children[2]).toBeDefined(); // PublicBadge
    });

    it('カテゴリのみがある場合、CategoryBadge と PublicBadge が含まれる', () => {
      const book = createMockBook({
        category: createMockCategory({ name: 'テストカテゴリ' }),
        tags: [],
      });

      const { result } = renderHook(() => useBookDetailView(book));

      // Fragment の props.children を確認
      const badges = result.current.badges as React.ReactElement<{ children: React.ReactNode[] }>;
      const children = badges.props.children;

      // 3つの子要素があることを確認（CategoryBadge, TagBadge(null), PublicBadge）
      expect(Array.isArray(children)).toBe(true);
      expect(children).toHaveLength(3);
      expect(children[0]).toBeDefined(); // CategoryBadge
      expect(children[1]).toBe(false); // TagBadge
      expect(children[2]).toBeDefined(); // PublicBadge
    });

    it('カテゴリーがない場合、PublicBadge のみが含まれる', () => {
      const book = createMockBook({ category: undefined, tags: [] });

      const { result } = renderHook(() => useBookDetailView(book));

      // Fragment の props.children を確認
      const badges = result.current.badges as React.ReactElement<{ children: React.ReactNode[] }>;
      const children = badges.props.children;

      // 3つの子要素があることを確認（CategoryBadge, TagBadge(null), PublicBadge）
      expect(Array.isArray(children)).toBe(true);
      expect(children[0]).toBe(undefined); // CategoryBadge
      expect(children[1]).toBeDefined(); // TagBadge
      expect(children[2]).toBeDefined(); // PublicBadge
    });
  });
});
