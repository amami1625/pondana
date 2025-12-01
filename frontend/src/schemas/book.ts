import { z } from 'zod';
import { categorySchema } from './category';
import { authorSchema } from './author';
import { listBookSchema } from '@/app/(protected)/listBooks/_types';
import { cardSchema } from '@/app/(protected)/cards/_types';

// Bookベーススキーマ
// TODO: タグ機能実装時にtagsフィールドを追加
export const bookBaseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  user_id: z.number(),
  category: categorySchema.optional(),
  rating: z.number().int().min(1).max(5).nullable(),
  reading_status: z.enum(['unread', 'reading', 'completed']),
  public: z.boolean(),
  created_at: z.string().transform((str) => {
    return new Date(str).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });
  }),
  updated_at: z.string().transform((str) => {
    return new Date(str).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    });
  }),
});

// Book一覧データのバリデーションスキーマ(APIレスポンス用)
export const bookSchema = bookBaseSchema.extend({
  authors: authorSchema.array(),
});

// Book詳細データのバリデーションスキーマ(APIレスポンス用)
export const bookDetailSchema = bookSchema.extend({
  lists: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      public: z.boolean(),
    }),
  ),
  list_books: z.array(listBookSchema),
  cards: z.array(cardSchema),
});

// Bookのバリデーションスキーマ(フォーム用)
// TODO: タグ機能実装時にtagsフィールドを追加
export const bookFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'タイトルを入力してください' })
    .max(255, { message: 'タイトルは255文字以内で入力してください' }),
  description: z.string().optional(),
  author_ids: z.number().array().min(1, { message: '著者を1人以上選択してください' }),
  category_id: z.number().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  reading_status: z.enum(['unread', 'reading', 'completed']),
  public: z.boolean(),
});

export type BookBase = z.infer<typeof bookBaseSchema>;
export type Book = z.infer<typeof bookSchema>;
export type BookDetail = z.infer<typeof bookDetailSchema>;
export type BookFormData = z.infer<typeof bookFormSchema>;

// 本に追加されたリストの型
export type AddedList = BookDetail['lists'][number];
