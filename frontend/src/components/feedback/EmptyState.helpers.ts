import { BookOpen, Library, StickyNote, LucideIcon } from 'lucide-react';

type Element = '本' | 'リスト' | 'カード';
type Context = 'list' | 'detail';

export function getIcon(element: Element): LucideIcon {
  switch (element) {
    case '本':
      return BookOpen;
    case 'リスト':
      return Library;
    case 'カード':
      return StickyNote;
    default:
      return BookOpen;
  }
}

export function getMessage(
  element: Element,
  context: Context = 'list',
): { title: string; description: string } {
  if (context === 'detail') {
    switch (element) {
      case '本':
        return {
          title: 'まだ本が登録されていません',
          description: 'リストに本を追加してみましょう',
        };
      case 'リスト':
        return {
          title: 'まだリストに追加されていません',
          description: '本をリストに追加してみましょう',
        };
      case 'カード':
        return {
          title: 'まだカードが登録されていません',
          description: 'カードを作成してメモを残しましょう',
        };
    }
  }

  // デフォルト（一覧ページ用）
  return {
    title: `まだ${element}が登録されていません`,
    description: `最初の${element}を登録してみましょう`,
  };
}
