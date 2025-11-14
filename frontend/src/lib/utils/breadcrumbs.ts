import { BREADCRUMB_PATHS, BreadcrumbItem } from '@/constants/breadcrumbs';

/**
 * 書籍詳細ページのパンくずリストを生成
 */
export function getBookDetailBreadcrumbs(bookTitle: string): BreadcrumbItem[] {
  return [BREADCRUMB_PATHS.home, BREADCRUMB_PATHS.books, { label: bookTitle }];
}

/**
 * リスト詳細ページのパンくずリストを生成
 */
export function getListDetailBreadcrumbs(listName: string): BreadcrumbItem[] {
  return [BREADCRUMB_PATHS.home, BREADCRUMB_PATHS.lists, { label: listName }];
}

/**
 * カード詳細ページのパンくずリストを生成
 */
export function getCardDetailBreadcrumbs(cardTitle: string): BreadcrumbItem[] {
  return [BREADCRUMB_PATHS.home, BREADCRUMB_PATHS.cards, { label: cardTitle }];
}
