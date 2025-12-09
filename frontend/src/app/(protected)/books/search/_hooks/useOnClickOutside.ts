import { useEffect } from 'react';

/**
 * 指定された要素の外側をクリックしたときにコールバックを実行するカスタムフック
 *
 * @param inputRef - input 要素への参照
 * @param dropdownRef - ドロップダウン要素への参照
 * @param onClickOutside - 外側をクリックしたときに実行するコールバック
 * @param isOpen - フックを有効にするかどうか
 */
export function useOnClickOutside(
  inputRef: React.RefObject<HTMLInputElement | null>,
  dropdownRef: React.RefObject<HTMLDivElement | null>,
  onClickOutside: () => void,
  isOpen: boolean = true,
) {
  useEffect(() => {
    // ドロップダウンが閉じているときは外部クリックを検出をしない
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDropdown = dropdownRef.current && dropdownRef.current.contains(target);
      const clickedInsideInput = inputRef.current && inputRef.current.contains(target);

      // どちらの要素の中でもなければ「外側クリック」と判定
      if (!clickedInsideDropdown && !clickedInsideInput) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClickOutside]);
  // inputRef, dropdownRef は ref オブジェクトなので依存配列に不要
}
