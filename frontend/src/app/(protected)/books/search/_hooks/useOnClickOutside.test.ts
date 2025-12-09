import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOnClickOutside } from '@/app/(protected)/books/search/_hooks/useOnClickOutside';
import { useRef } from 'react';

describe('useOnClickOutside', () => {
  const mockCallback = vi.fn();

  beforeEach(() => {
    mockCallback.mockClear();
  });

  describe('外部クリック検出', () => {
    it('ref 要素の外側をクリックするとコールバックが呼ばれる', () => {
      const inputElement = document.createElement('input');
      const dropdownElement = document.createElement('div');
      const outsideElement = document.createElement('div');

      renderHook(() => {
        const inputRef = useRef<HTMLInputElement>(inputElement);
        const dropdownRef = useRef<HTMLDivElement>(dropdownElement);
        useOnClickOutside(inputRef, dropdownRef, mockCallback, true);
        return { inputRef, dropdownRef };
      });

      // 外側の要素でマウスダウンイベントを発火
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement, enumerable: true });
      document.dispatchEvent(event);

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('input 要素の内側をクリックするとコールバックが呼ばれない', () => {
      const inputElement = document.createElement('input');
      const dropdownElement = document.createElement('div');

      renderHook(() => {
        const inputRef = useRef<HTMLInputElement>(inputElement);
        const dropdownRef = useRef<HTMLDivElement>(dropdownElement);
        useOnClickOutside(inputRef, dropdownRef, mockCallback, true);
        return { inputRef, dropdownRef };
      });

      // input 要素でマウスダウンイベントを発火
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: inputElement, enumerable: true });
      document.dispatchEvent(event);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('dropdown 要素の内側をクリックするとコールバックが呼ばれない', () => {
      const inputElement = document.createElement('input');
      const dropdownElement = document.createElement('div');
      const childElement = document.createElement('button');
      dropdownElement.appendChild(childElement);

      renderHook(() => {
        const inputRef = useRef<HTMLInputElement>(inputElement);
        const dropdownRef = useRef<HTMLDivElement>(dropdownElement);
        useOnClickOutside(inputRef, dropdownRef, mockCallback, true);
        return { inputRef, dropdownRef };
      });

      // dropdown の子要素でマウスダウンイベントを発火
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: childElement, enumerable: true });
      document.dispatchEvent(event);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('ref.current が null の場合、外側クリックでコールバックが呼ばれる', () => {
      const outsideElement = document.createElement('div');

      renderHook(() => {
        const inputRef = useRef<HTMLInputElement>(null);
        const dropdownRef = useRef<HTMLDivElement>(null);
        useOnClickOutside(inputRef, dropdownRef, mockCallback, true);
        return { inputRef, dropdownRef };
      });

      // 外側の要素でマウスダウンイベントを発火
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement, enumerable: true });
      document.dispatchEvent(event);

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('isOpen パラメータ', () => {
    it('isOpen が false の場合、外側をクリックしてもコールバックが呼ばれない', () => {
      const inputElement = document.createElement('input');
      const dropdownElement = document.createElement('div');
      const outsideElement = document.createElement('div');

      renderHook(() => {
        const inputRef = useRef<HTMLInputElement>(inputElement);
        const dropdownRef = useRef<HTMLDivElement>(dropdownElement);
        useOnClickOutside(inputRef, dropdownRef, mockCallback, false);
        return { inputRef, dropdownRef };
      });

      // 外側の要素でマウスダウンイベントを発火
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement, enumerable: true });
      document.dispatchEvent(event);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('isOpen が true の場合、外側をクリックするとコールバックが呼ばれる', () => {
      const inputElement = document.createElement('input');
      const dropdownElement = document.createElement('div');
      const outsideElement = document.createElement('div');

      renderHook(() => {
        const inputRef = useRef<HTMLInputElement>(inputElement);
        const dropdownRef = useRef<HTMLDivElement>(dropdownElement);
        useOnClickOutside(inputRef, dropdownRef, mockCallback, true);
        return { inputRef, dropdownRef };
      });

      // 外側の要素でマウスダウンイベントを発火
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement, enumerable: true });
      document.dispatchEvent(event);

      expect(mockCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('クリーンアップ', () => {
    it('アンマウント時にイベントリスナーが削除される', () => {
      const inputElement = document.createElement('input');
      const dropdownElement = document.createElement('div');
      const outsideElement = document.createElement('div');

      const { unmount } = renderHook(() => {
        const inputRef = useRef<HTMLInputElement>(inputElement);
        const dropdownRef = useRef<HTMLDivElement>(dropdownElement);
        useOnClickOutside(inputRef, dropdownRef, mockCallback, true);
        return { inputRef, dropdownRef };
      });

      // アンマウント
      unmount();

      // 外側の要素でマウスダウンイベントを発火
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement, enumerable: true });
      document.dispatchEvent(event);

      // コールバックは呼ばれない（イベントリスナーが削除されているため）
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
});
