import { useState, useMemo } from 'react';
import { useCategories } from '@/app/(protected)/categories/_hooks/useCategories';
import { Book } from '@/app/(protected)/books/_types';

/**
 * 書籍一覧ビューのフィルタリングロジックを管理するカスタムフック
 *
 * カテゴリによる書籍のフィルタリング機能を提供します。
 * - ユーザーが作成したカテゴリ一覧を取得
 * - 選択されたカテゴリに基づいて書籍をフィルタリング
 *
 * @param books - フィルタリング対象の書籍一覧
 * @returns フィルタリング機能に必要な状態とデータ
 * @returns selectedCategory - 現在選択されているカテゴリ名（nullの場合は全件表示）
 * @returns setSelectedCategory - カテゴリ選択を変更する関数
 * @returns categories - フィルター選択肢として表示するカテゴリ名の配列（重複なし、ソート済み）
 * @returns filteredBooks - フィルタリング後の書籍一覧（選択されたカテゴリに該当する書籍のみ）
 */
export function useBookIndexView(books: Book[]) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data } = useCategories();

  // カテゴリ一覧をメモ化
  // ユーザーが作成したカテゴリから重複を除いてソートした配列を生成
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    data?.forEach((category) => {
      categorySet.add(category.name);
    });
    return Array.from(categorySet).sort();
  }, [data]);

  // フィルタリングされた書籍リスト
  // 選択されたカテゴリに該当する書籍のみを抽出
  const filteredBooks = useMemo(() => {
    // カテゴリが選択されていない場合は全件表示
    if (!selectedCategory) {
      return books;
    }
    return books.filter((book) => book.category?.name === selectedCategory);
  }, [books, selectedCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredBooks,
  };
}
