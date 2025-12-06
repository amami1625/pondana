import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { mockUseListMutations, mockUseModal } from '@/test/mocks';
import { createMockList } from '@/test/factories';
import { useListDetailView } from './useListDetailView';
import { createTestUuid } from '@/test/helpers';

// モックの設定
vi.mock('@/hooks/useModal');
vi.mock('@/app/(protected)/lists/_hooks/useListMutations');

describe('useListDetailView', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('handleDelete', () => {
    // 削除関数のモックを作成
    const mockDeleteList = vi.fn();

    beforeEach(() => {
      // カスタムフックのモックを作成
      mockUseListMutations({ deleteList: mockDeleteList });
      mockUseModal();
    });

    it('ユーザーが削除をキャンセルした場合、削除されない', () => {
      // 確認ダイアログを偽物にして、falseを返す
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const list = createMockList({ id: createTestUuid(1) });

      const { result } = renderHook(() => useListDetailView(list));

      // 削除を実行
      result.current.handleDelete(createTestUuid(1));

      // 確認ダイアログが表示されたことを確認
      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');

      // 削除関数は呼ばれていないことを確認（キャンセルしたから）
      expect(mockDeleteList).not.toHaveBeenCalled();
    });

    it('ユーザーが削除をキャンセルしなかった場合、削除される', () => {
      // 確認ダイアログを偽物にして、true を返す
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const list = createMockList({ id: createTestUuid(1) });

      const { result } = renderHook(() => useListDetailView(list));

      // 削除を実行
      result.current.handleDelete(createTestUuid(1));

      // 確認ダイアログが表示されたことを確認
      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');

      // 削除関数が正しい引数で呼ばれたことを確認
      expect(mockDeleteList).toHaveBeenCalledWith(createTestUuid(1));
    });
  });

  describe('breadcrumbItems', () => {
    it('パンくずリストが正しく生成される', () => {
      const list = createMockList({ name: 'テストリスト' });

      const { result } = renderHook(() => useListDetailView(list));

      expect(result.current.breadcrumbItems).toHaveLength(3);
      expect(result.current.breadcrumbItems[2].label).toBe('テストリスト');
    });
  });

  describe('モーダル', () => {
    it('updateModal, addBookModal が返される', () => {
      mockUseModal();

      const list = createMockList();
      const { result } = renderHook(() => useListDetailView(list));

      // 2つのモーダルが存在することを確認
      expect(result.current.updateModal).toBeDefined();
      expect(result.current.addBookModal).toBeDefined();
    });
  });

  describe('badges', () => {
    it('badges が JSX 要素として定義されている', () => {
      const list = createMockList();
      const { result } = renderHook(() => useListDetailView(list));

      // badges が定義されていることを確認
      expect(result.current.badges).toBeDefined();
      // JSX 要素であることを確認
      expect(result.current.badges).toHaveProperty('type');
    });
  });
});
