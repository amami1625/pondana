import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { mockUseModal, mockUseTagMutations } from '@/test/mocks';
import { createMockTag } from '@/test/factories/tag';
import { useSettingTag } from './useSettingTag';

// モックの設定
vi.mock('@/hooks/useModal');
vi.mock('@/app/(protected)/tags/_hooks/useTagMutations');

describe('useSettingTag', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
    mockUseTagMutations();
    mockUseModal();
  });

  describe('初期状態', () => {
    it('editingTag が undefined になっている', () => {
      const { result } = renderHook(() => useSettingTag());

      expect(result.current.editingTag).toBeUndefined();
    });
  });

  describe('handleEdit', () => {
    it('タグを選択し、編集用モーダルが開く', () => {
      const mockTag = createMockTag({ name: 'テストタグ' });
      const { result } = renderHook(() => useSettingTag());

      act(() => result.current.handleEdit(mockTag));

      expect(result.current.editingTag).toEqual(mockTag);
      expect(result.current.editModal.open).toHaveBeenCalled();
    });
  });

  describe('handleCreate', () => {
    it('選択中のタグを無効化し、作成用モーダルが開く', () => {
      const mockTag = createMockTag({ name: 'テストタグ' });
      const { result } = renderHook(() => useSettingTag());

      // まず編集モードにする
      act(() => result.current.handleEdit(mockTag));
      expect(result.current.editingTag).toEqual(mockTag);

      // 作成モードに切り替える
      act(() => result.current.handleCreate());

      // editingTag がクリアされていることを確認
      expect(result.current.editingTag).toBeUndefined();
      expect(result.current.createModal.open).toHaveBeenCalled();
    });
  });
});
