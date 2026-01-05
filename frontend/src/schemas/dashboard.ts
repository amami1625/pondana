import { z } from 'zod';

/**
 * ダッシュボードの概要統計スキーマ
 */
export const overviewStatsSchema = z.object({
  total_books: z.number(),
  total_cards: z.number(),
  total_categories: z.number(),
  total_tags: z.number(),
});

/**
 * 月別統計の項目スキーマ
 */
export const monthlyStatItemSchema = z.object({
  month: z.string(),
  count: z.number(),
});

/**
 * 月別統計スキーマ
 * [{ month: "2025-01", count: 3 }, { month: "2024-12", count: 5 }, ...]
 */
export const monthlyStatsSchema = z.array(monthlyStatItemSchema);

/**
 * カテゴリー別統計の項目スキーマ
 */
export const categoryStatItemSchema = z.object({
  name: z.string(),
  count: z.number(),
});

/**
 * カテゴリー別統計スキーマ
 * [{ name: "プログラミング", count: 15 }, { name: "インフラ", count: 8 }, ...]
 */
export const categoryStatsSchema = z.array(categoryStatItemSchema);

/**
 * タグ別統計の項目スキーマ
 */
export const tagStatItemSchema = z.object({
  name: z.string(),
  count: z.number(),
});

/**
 * タグ別統計スキーマ
 * [{ name: "Ruby", count: 10 }, { name: "Rails", count: 8 }, ...]
 */
export const tagStatsSchema = z.array(tagStatItemSchema);

/**
 * 最近の書籍スキーマ
 */
export const recentBookSchema = z.object({
  id: z.string(),
  title: z.string(),
  created_at: z.string(),
});

/**
 * ダッシュボード全体のレスポンススキーマ
 */
export const dashboardSchema = z.object({
  overview: overviewStatsSchema,
  monthly: monthlyStatsSchema,
  categories: categoryStatsSchema,
  tags: tagStatsSchema,
  recent_books: z.array(recentBookSchema),
});

/**
 * TypeScript型定義
 */
export type OverviewStats = z.infer<typeof overviewStatsSchema>;
export type MonthlyStatItem = z.infer<typeof monthlyStatItemSchema>;
export type MonthlyStats = z.infer<typeof monthlyStatsSchema>;
export type CategoryStatItem = z.infer<typeof categoryStatItemSchema>;
export type CategoryStats = z.infer<typeof categoryStatsSchema>;
export type TagStatItem = z.infer<typeof tagStatItemSchema>;
export type TagStats = z.infer<typeof tagStatsSchema>;
export type RecentBook = z.infer<typeof recentBookSchema>;
export type Dashboard = z.infer<typeof dashboardSchema>;
