import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { mockUseModal } from '@/test/mocks';
import { mockUseCategoryMutations } from '@/test/mocks';
import { createMockCategory } from '@/test/factories';
import { useSettingCategory } from './useSettingCategory';

// モックの設定
vi.mock('@/hooks/useModal');
vi.mock('@/app/(protected)/categories/_hooks/useCategoryMutations');

describe('useSettingCategory', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
    mockUseCategoryMutations();
    mockUseModal();
  });

  describe('初期状態', () => {
    it('editingCategory が undefined になっている', () => {
      const { result } = renderHook(() => useSettingCategory());

      expect(result.current.editingCategory).toBeUndefined();
    });
  });

  describe('handleEdit', () => {
    it('カテゴリを選択し、編集用モーダルが開く', () => {
      const mockCategory = createMockCategory({ name: 'テストカテゴリ' });
      const { result } = renderHook(() => useSettingCategory());

      act(() => result.current.handleEdit(mockCategory));

      expect(result.current.editingCategory).toEqual(mockCategory);
      expect(result.current.editModal.open).toHaveBeenCalled();
    });
  });

  describe('handleCreate', () => {
    it('選択中のカテゴリを無効化し、作成用モーダルが開く', () => {
      const mockCategory = createMockCategory({ name: 'テストカテゴリ' });
      const { result } = renderHook(() => useSettingCategory());

      act(() => result.current.handleEdit(mockCategory));

      // まず編集モードにする
      act(() => result.current.handleEdit(mockCategory));
      expect(result.current.editingCategory).toEqual(mockCategory);

      // 作成モードに切り替える
      act(() => result.current.handleCreate());

      // editingCategoryがクリアされていることを確認
      expect(result.current.editingCategory).toBeUndefined();
      expect(result.current.createModal.open).toHaveBeenCalled();
    });
  });

  describe('handleDelete', () => {
    const mockDeleteCategory = vi.fn();

    beforeEach(() => {
      mockUseCategoryMutations({ deleteCategory: mockDeleteCategory });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('ユーザーが削除をキャンセルした場合、削除されない', () => {
      // 確認ダイアログを偽物にして、falseを返す
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const { result } = renderHook(() => useSettingCategory());

      result.current.handleDelete(1);

      // 確認ダイアログが表示されたことを確認
      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');

      // 削除関数は呼ばれていないことを確認
      expect(mockDeleteCategory).not.toHaveBeenCalled();
    });

    it('ユーザーが削除をキャンセルしなかった場合、削除される', () => {
      // 確認ダイアログを偽物にして、trueを返す
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const { result } = renderHook(() => useSettingCategory());

      result.current.handleDelete(1);

      // 確認ダイアログが表示されたことを確認
      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');

      // 削除関数が正しい引数で呼ばれたことを確認
      expect(mockDeleteCategory).toHaveBeenCalledWith(1);
    });
  });
});
