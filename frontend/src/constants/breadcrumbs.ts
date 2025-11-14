// パンくずリストの基本定義
export const BREADCRUMB_PATHS = {
  home: { label: 'ホーム', href: '/top' },
  books: { label: '本一覧', href: '/books' },
  lists: { label: 'リスト一覧', href: '/lists' },
  cards: { label: 'カード一覧', href: '/cards' },
} as const;

// パンくずリストのアイテム型
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
