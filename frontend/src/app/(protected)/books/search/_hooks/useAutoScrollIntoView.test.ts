import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutoScrollIntoView } from '@/app/(protected)/books/search/_hooks/useAutoScrollIntoView';

describe('useAutoScrollIntoView', () => {
  let mockScrollIntoView: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockScrollIntoView = vi.fn();
  });

  describe('スクロール動作', () => {
    it('selectedIndex が 0 以上で isOpen が true の場合、scrollIntoView が呼ばれる', () => {
      const itemRefs = {
        current: [
          { scrollIntoView: mockScrollIntoView } as unknown as HTMLElement,
          { scrollIntoView: vi.fn() } as unknown as HTMLElement,
        ],
      };

      renderHook(() => useAutoScrollIntoView(0, itemRefs, true));

      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'nearest',
      });
    });

    it('selectedIndex が -1 の場合、scrollIntoView は呼ばれない', () => {
      const itemRefs = {
        current: [{ scrollIntoView: mockScrollIntoView } as unknown as HTMLElement],
      };

      renderHook(() => useAutoScrollIntoView(-1, itemRefs, true));

      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it('isOpen が false の場合、scrollIntoView は呼ばれない', () => {
      const itemRefs = {
        current: [{ scrollIntoView: mockScrollIntoView } as unknown as HTMLElement],
      };

      renderHook(() => useAutoScrollIntoView(0, itemRefs, false));

      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it('itemRefs.current[selectedIndex] が null の場合、scrollIntoView は呼ばれない', () => {
      const itemRefs = {
        current: [null],
      };

      renderHook(() => useAutoScrollIntoView(0, itemRefs, true));

      // エラーにならないことを確認（scrollIntoView は呼ばれない）
      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });

    it('selectedIndex が配列の範囲外の場合、エラーにならない', () => {
      const itemRefs = {
        current: [{ scrollIntoView: mockScrollIntoView } as unknown as HTMLElement],
      };

      // 範囲外のインデックス
      expect(() => {
        renderHook(() => useAutoScrollIntoView(10, itemRefs, true));
      }).not.toThrow();

      expect(mockScrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe('selectedIndex の変更', () => {
    it('selectedIndex が変更されると、新しい要素に scrollIntoView が呼ばれる', () => {
      const mockScrollIntoView1 = vi.fn();
      const mockScrollIntoView2 = vi.fn();

      const itemRefs = {
        current: [
          { scrollIntoView: mockScrollIntoView1 } as unknown as HTMLElement,
          { scrollIntoView: mockScrollIntoView2 } as unknown as HTMLElement,
        ],
      };

      const { rerender } = renderHook(({ index }) => useAutoScrollIntoView(index, itemRefs, true), {
        initialProps: { index: 0 },
      });

      expect(mockScrollIntoView1).toHaveBeenCalledTimes(1);
      expect(mockScrollIntoView2).not.toHaveBeenCalled();

      // selectedIndex を 1 に変更
      rerender({ index: 1 });

      expect(mockScrollIntoView1).toHaveBeenCalledTimes(1); // 変わらず
      expect(mockScrollIntoView2).toHaveBeenCalledTimes(1); // 新しく呼ばれる
    });
  });

  describe('isOpen の変更', () => {
    it('isOpen が false から true に変わると scrollIntoView が呼ばれる', () => {
      const itemRefs = {
        current: [{ scrollIntoView: mockScrollIntoView } as unknown as HTMLElement],
      };

      const { rerender } = renderHook(({ isOpen }) => useAutoScrollIntoView(0, itemRefs, isOpen), {
        initialProps: { isOpen: false },
      });

      expect(mockScrollIntoView).not.toHaveBeenCalled();

      // isOpen を true に変更
      rerender({ isOpen: true });

      expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
    });
  });
});
