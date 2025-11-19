import type { TopPageData } from '@/schemas/top';
/**
 * トップページデータのモックを作成するファクトリ関数
 */
export const createMockTopPageData = (overrides?: Partial<TopPageData>): TopPageData => ({
  recent_books: [],
  recent_lists: [],
  recent_cards: [],
  ...overrides,
});
