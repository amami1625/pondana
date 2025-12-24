import { useMemo, useState } from 'react';
import { useStatuses } from '@/app/(protected)/statuses/_hooks/useStatuses';
import { CardList } from '@/app/(protected)/cards/_types';

/**
 * カード一覧ビューのフィルタリングロジックを管理するカスタムフック
 *
 * ステータスによるカードのフィルタリング機能を提供します。
 * - ユーザーが作成したステータス一覧を取得
 * - 選択されたステータスに基づいてカードをフィルタリング
 * - カードが0件のグループは除外
 *
 * @param cardList - フィルタリング対象のカード一覧（書籍ごとにグループ化されたデータ）
 * @returns フィルタリング機能に必要な状態とデータ
 * @returns statuses - フィルター選択肢として表示するステータス名の配列（重複なし、ソート済み）
 * @returns selectedStatus - 現在選択されているステータス名（nullの場合は全件表示）
 * @returns setSelectedStatus - ステータス選択を変更する関数
 * @returns filteredCards - フィルタリング後のカード一覧（選択されたステータスに該当するカードのみ）
 */
export function useCardListView(cardList: CardList) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { data } = useStatuses();

  // ステータス一覧をメモ化
  // ユーザーが作成したステータスから重複を除いてソートした配列を生成
  const statuses = useMemo(() => {
    const statusSet = new Set<string>();
    data?.forEach((status) => {
      statusSet.add(status.name);
    });
    return Array.from(statusSet).sort();
  }, [data]);

  // フィルタリングされたカード
  // 選択されたステータスに該当するカードのみを抽出し、カードが0件のグループは除外
  const filteredCards = useMemo(() => {
    // ステータスが選択されていない場合は全件表示
    if (!selectedStatus) {
      return cardList.books;
    }

    // 各グループ（書籍）のカードをフィルタリングし、カードが残っているグループのみ返す
    return cardList.books
      .map((group) => ({
        book: group.book,
        cards: group.cards.filter((card) => card.status?.name === selectedStatus),
      }))
      .filter((group) => group.cards.length > 0);
  }, [cardList, selectedStatus]);

  return {
    statuses,
    selectedStatus,
    setSelectedStatus,
    filteredCards,
  };
}
