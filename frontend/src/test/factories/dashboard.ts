import type {
  Dashboard,
  OverviewStats,
  MonthlyStats,
  CategoryStats,
  TagStats,
  RecentBook,
} from '@/schemas/dashboard';

/**
 * テスト用の Overview オブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns OverviewStats 型のモックオブジェクト
 */
export const createMockOverview = (overrides?: Partial<OverviewStats>): OverviewStats => ({
  total_books: 10,
  total_cards: 25,
  total_categories: 3,
  total_tags: 8,
  ...overrides,
});

/**
 * テスト用の MonthlyStats オブジェクトを作成するファクトリー関数
 * @returns MonthlyStats 型のモックオブジェクト（過去12ヶ月分）
 */
export const createMockMonthlyStats = (): MonthlyStats => [
  { month: '2024-02', count: 1 },
  { month: '2024-03', count: 2 },
  { month: '2024-04', count: 0 },
  { month: '2024-05', count: 3 },
  { month: '2024-06', count: 1 },
  { month: '2024-07', count: 4 },
  { month: '2024-08', count: 2 },
  { month: '2024-09', count: 0 },
  { month: '2024-10', count: 3 },
  { month: '2024-11', count: 5 },
  { month: '2024-12', count: 2 },
  { month: '2025-01', count: 3 },
];

/**
 * テスト用の CategoryStats オブジェクトを作成するファクトリー関数
 * @returns CategoryStats 型のモックオブジェクト
 */
export const createMockCategoryStats = (): CategoryStats => [
  { name: 'プログラミング', count: 5 },
  { name: 'インフラ', count: 3 },
  { name: 'ビジネス', count: 2 },
];

/**
 * テスト用の TagStats オブジェクトを作成するファクトリー関数
 * @returns TagStats 型のモックオブジェクト
 */
export const createMockTagStats = (): TagStats => [
  { name: 'Ruby', count: 4 },
  { name: 'Rails', count: 3 },
  { name: 'React', count: 2 },
  { name: 'TypeScript', count: 2 },
];

/**
 * テスト用の RecentBooks 配列を作成するファクトリー関数
 * @returns RecentBook[] 型のモックオブジェクト（5件）
 */
export const createMockRecentBooks = (): RecentBook[] => [
  { id: 'book-1', title: 'リーダブルコード', created_at: '2025-01-05T00:00:00.000Z' },
  { id: 'book-2', title: 'Clean Code', created_at: '2025-01-04T00:00:00.000Z' },
  { id: 'book-3', title: 'プログラミングElixir', created_at: '2025-01-03T00:00:00.000Z' },
  { id: 'book-4', title: 'オブジェクト指向設計実践ガイド', created_at: '2025-01-02T00:00:00.000Z' },
  { id: 'book-5', title: 'リファクタリング', created_at: '2025-01-01T00:00:00.000Z' },
];

/**
 * テスト用の Dashboard 全体のオブジェクトを作成するファクトリー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 * @returns Dashboard 型のモックオブジェクト
 */
export const createMockDashboard = (overrides?: Partial<Dashboard>): Dashboard => ({
  overview: createMockOverview(),
  monthly: createMockMonthlyStats(),
  categories: createMockCategoryStats(),
  tags: createMockTagStats(),
  recent_books: createMockRecentBooks(),
  ...overrides,
});
