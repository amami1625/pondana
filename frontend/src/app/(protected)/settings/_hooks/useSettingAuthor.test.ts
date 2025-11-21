import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { mockUseModal } from '@/test/mocks';
import { createMockAuthor } from '@/test/factories';
import { mockUseAuthorMutations } from '@/test/mocks';
import { useSettingAuthor } from './useSettingAuthor';

// モックの設定
vi.mock('@/hooks/useModal');
vi.mock('@/app/(protected)/authors/_hooks/useAuthorMutations');

describe('useSettingAuthor', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
    mockUseAuthorMutations();
    mockUseModal();
  });

  describe('初期状態', () => {
    it('editingAuthor が undefined になっている', () => {
      const { result } = renderHook(() => useSettingAuthor());

      expect(result.current.editingAuthor).toBeUndefined();
    });
  });

  describe('handleEdit', () => {
    it('著者を選択し、編集用モーダルが開く', () => {
      const mockAuthor = createMockAuthor({ name: 'テスト著者' });
      const { result } = renderHook(() => useSettingAuthor());

      act(() => result.current.handleEdit(mockAuthor));

      expect(result.current.editingAuthor).toEqual(mockAuthor);
      expect(result.current.editModal.open).toHaveBeenCalled();
    });
  });

  describe('handleCreate', () => {
    it('選択中の著者を無効化し、作成用モーダルが開く', () => {
      const mockAuthor = createMockAuthor({ name: '編集中の著者' });
      const { result } = renderHook(() => useSettingAuthor());

      // まず編集モードにする
      act(() => result.current.handleEdit(mockAuthor));
      expect(result.current.editingAuthor).toEqual(mockAuthor);

      // 作成モードに切り替える
      act(() => result.current.handleCreate());

      // editingAuthorがクリアされていることを確認
      expect(result.current.editingAuthor).toBeUndefined();
      expect(result.current.createModal.open).toHaveBeenCalled();
    });
  });

  describe('handleDelete', () => {
    const mockDeleteAuthor = vi.fn();

    beforeEach(() => {
      mockUseAuthorMutations({ deleteAuthor: mockDeleteAuthor });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('ユーザーが削除をキャンセルした場合、削除されない', () => {
      // 確認ダイアログを偽物にして、falseを返す
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const { result } = renderHook(() => useSettingAuthor());

      result.current.handleDelete(1);

      // 確認ダイアログが表示されたことを確認
      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');

      // 削除関数は呼ばれていないことを確認
      expect(mockDeleteAuthor).not.toHaveBeenCalled();
    });

    it('ユーザーが削除をキャンセルしなかった場合、削除される', () => {
      // 確認ダイアログを偽物にして、trueを返す
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const { result } = renderHook(() => useSettingAuthor());

      result.current.handleDelete(1);

      // 確認ダイアログが表示されたことを確認
      expect(confirmSpy).toHaveBeenCalledWith('本当に削除しますか？');

      // 削除関数が正しい引数で呼ばれたことを確認
      expect(mockDeleteAuthor).toHaveBeenCalledWith(1);
    });
  });
});
