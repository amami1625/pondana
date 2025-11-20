import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModal } from './useModal';

describe('useModal', () => {
  it('初期状態でモーダルが閉じている', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.isOpen).toBe(false);
  });

  it('open()を呼ぶとモーダルが開く', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('close()を呼ぶとモーダルが閉じる', () => {
    const { result } = renderHook(() => useModal());

    // まずモーダルを開く
    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);

    // モーダルを閉じる
    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('open()とclose()を連続して呼んでも正しく動作する', () => {
    const { result } = renderHook(() => useModal());

    // 開く
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    // 閉じる
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);

    // もう一度開く
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);
  });
});
