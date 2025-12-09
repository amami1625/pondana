import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createMockGoogleBooksVolume } from '@/test/factories';
import { useBookSuggestions } from '@/app/(protected)/books/search/_hooks/useBookSuggestions';
import { GoogleBooksVolume } from '../../_types';

describe('useBookSuggestions', () => {
  const mockOnSelectBook = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('isOpen が false になっている', () => {
      const { result } = renderHook(() => useBookSuggestions([], mockOnSelectBook));

      expect(result.current.selectedIndex).toBe(-1);
    });

    it('selectedIndex が -1 になっている', () => {
      const { result } = renderHook(() => useBookSuggestions([], mockOnSelectBook));

      expect(result.current.selectedIndex).toBe(-1);
    });
  });

  describe('useEffect: suggestions の変化', () => {
    it('初回レンダリング時、isOpen は false、selectedIndex は -1 のまま', () => {
      const { result } = renderHook(() => useBookSuggestions([], mockOnSelectBook));

      expect(result.current.isOpen).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
    });

    it('候補が追加されたら isOpen が true になり、selectedIndex が 0 になる', () => {
      const mockBook = createMockGoogleBooksVolume();

      // 最初は空配列
      const { result, rerender } = renderHook(
        ({ suggestions }) => useBookSuggestions(suggestions, mockOnSelectBook),
        {
          initialProps: { suggestions: <GoogleBooksVolume[]>[] },
        },
      );

      // 初期状態を確認
      expect(result.current.isOpen).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);

      // 候補を追加（useEffect がトリガーされる）
      rerender({ suggestions: [mockBook] });

      // isOpen が true、selectedIndex が 0 になる
      expect(result.current.isOpen).toBe(true);
      expect(result.current.selectedIndex).toBe(0);
    });

    it('候補が削除されたら isOpen が false になり、selectedIndex が -1 になる', () => {
      const mockBook = createMockGoogleBooksVolume();

      // 最初は候補あり
      const { result, rerender } = renderHook(
        ({ suggestions }) => useBookSuggestions(suggestions, mockOnSelectBook),
        {
          initialProps: { suggestions: [mockBook] },
        },
      );

      // 初期状態を確認
      expect(result.current.isOpen).toBe(true);
      expect(result.current.selectedIndex).toBe(0);

      // 候補を空にする（useEffect がトリガーされる）
      rerender({ suggestions: [] });

      // isOpen が false、selectedIndex が -1 になる
      expect(result.current.isOpen).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
    });

    it('候補が変わると isOpen は true のままで selectedIndex は 0 になる', () => {
      const mockBook1 = createMockGoogleBooksVolume({ id: 'book-1' });
      const mockBook2 = createMockGoogleBooksVolume({ id: 'book-2' });

      // 最初は book-1 が2つ（ArrowDownでインデックスを増やすため）
      const { result, rerender } = renderHook(
        ({ suggestions }) => useBookSuggestions(suggestions, mockOnSelectBook),
        {
          initialProps: { suggestions: [mockBook1, mockBook1] },
        },
      );

      expect(result.current.isOpen).toBe(true);
      expect(result.current.selectedIndex).toBe(0);

      // ArrowDown で selectedIndex を 1 にする
      act(() => {
        result.current.handleKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      // selectedIndex が 1 に変わる
      expect(result.current.selectedIndex).toBe(1);

      // book-2 に変更（useEffect がトリガーされる）
      rerender({ suggestions: [mockBook2] });

      // isOpen は true のまま、selectedIndex は 0（useEffectでリセットされる）
      expect(result.current.isOpen).toBe(true);
      expect(result.current.selectedIndex).toBe(0);
    });
  });

  describe('handleKeyDown', () => {
    it('ArrowDown で selectedIndex が増える', () => {
      const suggestions = [
        createMockGoogleBooksVolume({ id: 'book-1' }),
        createMockGoogleBooksVolume({ id: 'book-2' }),
        createMockGoogleBooksVolume({ id: 'book-3' }),
      ];

      const { result } = renderHook(() => useBookSuggestions(suggestions, mockOnSelectBook));

      // 初期状態: selectedIndex = 0
      expect(result.current.selectedIndex).toBe(0);

      // ArrowDown を押す
      const event = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.selectedIndex).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('ArrowDown で最後の候補を超えない', () => {
      const suggestions = [
        createMockGoogleBooksVolume({ id: 'book-1' }),
        createMockGoogleBooksVolume({ id: 'book-2' }),
      ];
      const { result } = renderHook(() => useBookSuggestions(suggestions, mockOnSelectBook));

      // selectedIndex を 1 (最後) にする
      const arrowDownEvent = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(arrowDownEvent);
      });

      expect(result.current.selectedIndex).toBe(1);

      // もう一度 ArrowDown を押しても 1 のまま
      act(() => {
        result.current.handleKeyDown(arrowDownEvent);
      });

      expect(result.current.selectedIndex).toBe(1);
    });

    it('ArrowUp で selectedIndex が減る', () => {
      const suggestions = [
        createMockGoogleBooksVolume({ id: 'book-1' }),
        createMockGoogleBooksVolume({ id: 'book-2' }),
        createMockGoogleBooksVolume({ id: 'book-3' }),
      ];

      const { result } = renderHook(() => useBookSuggestions(suggestions, mockOnSelectBook));

      // まず ArrowDown で selectedIndex を 1 にする
      const arrowDownEvent = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(arrowDownEvent);
      });

      expect(result.current.selectedIndex).toBe(1);

      // ArrowUp を押す
      const arrowUpEvent = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(arrowUpEvent);
      });

      expect(result.current.selectedIndex).toBe(0);
      expect(arrowUpEvent.preventDefault).toHaveBeenCalled();
    });

    it('ArrowUp で selectedIndex が -1 になる（選択なし）', () => {
      const suggestions = [
        createMockGoogleBooksVolume({ id: 'book-1' }),
        createMockGoogleBooksVolume({ id: 'book-2' }),
      ];

      const { result } = renderHook(() => useBookSuggestions(suggestions, mockOnSelectBook));

      // 初期状態: selectedIndex = 0
      expect(result.current.selectedIndex).toBe(0);

      // ArrowUp を押す
      const event = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.selectedIndex).toBe(-1);
    });

    it('ArrowUp で selectedIndex が -1 を下回らない', () => {
      const suggestions = [
        createMockGoogleBooksVolume({ id: 'book-1' }),
        createMockGoogleBooksVolume({ id: 'book-2' }),
      ];

      const { result } = renderHook(() => useBookSuggestions(suggestions, mockOnSelectBook));

      // 初期状態: selectedIndex = 0
      expect(result.current.selectedIndex).toBe(0);

      // まず ArrowUp を押して selectedIndex を -1 にする
      const arrowUpEvent = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(arrowUpEvent);
      });

      expect(result.current.selectedIndex).toBe(-1);

      // もう一度 ArrowUp を押しても -1 のまま
      act(() => {
        result.current.handleKeyDown(arrowUpEvent);
      });

      expect(result.current.selectedIndex).toBe(-1);
    });

    it('Escape で isOpen が false になり、selectedIndex が -1 になる', () => {
      const suggestions = [
        createMockGoogleBooksVolume({ id: 'book-1' }),
        createMockGoogleBooksVolume({ id: 'book-2' }),
      ];

      const { result } = renderHook(() => useBookSuggestions(suggestions, mockOnSelectBook));

      // 初期状態
      expect(result.current.isOpen).toBe(true);
      expect(result.current.selectedIndex).toBe(0);

      // Escape を押す
      const event = {
        key: 'Escape',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(event);
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.selectedIndex).toBe(-1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('Enter で選択された本が onSelectBook に渡され、isOpen が false になる', () => {
      const mockBook1 = createMockGoogleBooksVolume({ id: 'book-1' });
      const mockBook2 = createMockGoogleBooksVolume({ id: 'book-2' });
      const suggestions = [mockBook1, mockBook2];

      const { result } = renderHook(() => useBookSuggestions(suggestions, mockOnSelectBook));

      // ArrowDown で selectedIndex を 1 にする
      const arrowDownEvent = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(arrowDownEvent);
      });

      expect(result.current.selectedIndex).toBe(1);

      // Enter を押す
      const enterEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(enterEvent);
      });

      // onSelectBook が mockBook2 で呼ばれる
      expect(mockOnSelectBook).toHaveBeenCalledWith(mockBook2);
      expect(result.current.isOpen).toBe(false);
      expect(enterEvent.preventDefault).toHaveBeenCalled();
    });

    it('selectedIndex が -1 の時に Enter を押しても onSelectBook は呼ばれない', () => {
      const mockBook1 = createMockGoogleBooksVolume({ id: 'book-1' });
      const mockBook2 = createMockGoogleBooksVolume({ id: 'book-2' });
      const suggestions = [mockBook1, mockBook2];

      const { result } = renderHook(() => useBookSuggestions(suggestions, mockOnSelectBook));

      // ArrowUp で selectedIndex を -1 にする
      const arrowUpEvent = {
        key: 'ArrowUp',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(arrowUpEvent);
      });

      expect(result.current.selectedIndex).toBe(-1);

      // Enter を押す
      const enterEvent = {
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(enterEvent);
      });

      // onSelectBook は呼ばれない
      expect(mockOnSelectBook).not.toHaveBeenCalled();
    });

    it('候補がない場合、キー操作は何もしない', () => {
      const { result } = renderHook(() => useBookSuggestions([], mockOnSelectBook));

      const event = {
        key: 'ArrowDown',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(event);
      });

      // selectedIndex と isOpen は変わらない
      expect(result.current.selectedIndex).toBe(-1);
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('handleClickItem', () => {
    it('指定されたインデックスの本を選択する', () => {
      const mockBook1 = createMockGoogleBooksVolume({ id: 'book-1' });
      const mockBook2 = createMockGoogleBooksVolume({ id: 'book-2' });
      const suggestions = [mockBook1, mockBook2];

      const { result } = renderHook(() => useBookSuggestions(suggestions, mockOnSelectBook));

      act(() => {
        result.current.handleClickItem(1);
      });

      // onSelectBook が mockBook2 で呼ばれる
      expect(mockOnSelectBook).toHaveBeenCalledWith(mockBook2);
      // selectedIndex が 1 になる
      expect(result.current.selectedIndex).toBe(1);
      // isOpen が false になる
      expect(result.current.isOpen).toBe(false);
    });

    it('存在しないインデックスの場合は何もしない', () => {
      const mockBook1 = createMockGoogleBooksVolume({ id: 'book-1' });
      const mockBook2 = createMockGoogleBooksVolume({ id: 'book-2' });
      const suggestions = [mockBook1, mockBook2];

      const { result } = renderHook(() => useBookSuggestions(suggestions, mockOnSelectBook));

      act(() => {
        result.current.handleClickItem(999); // 存在しないインデックス
      });

      // onSelectBook は呼ばれない
      expect(mockOnSelectBook).not.toHaveBeenCalled();
    });
  });
});
