import { useEffect } from 'react';

/**
 * 選択されたアイテムまで自動的にスクロールするカスタムフック
 *
 * @param selectedIndex - 選択されたアイテムのインデックス
 * @param itemRefs - アイテム要素への参照の配列
 * @param isOpen - ドロップダウンが開いているかどうか
 */
export function useAutoScrollIntoView(
  selectedIndex: number,
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>,
  isOpen: boolean,
) {
  useEffect(() => {
    if (isOpen && selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isOpen, selectedIndex, itemRefs]);
}
