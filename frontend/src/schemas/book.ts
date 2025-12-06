import { z } from 'zod';
import { categorySchema } from '@/schemas/category';
import { tagSchema } from '@/schemas/tag';
import { listBookSchema } from '@/app/(protected)/listBooks/_types';
import { cardSchema } from '@/app/(protected)/cards/_types';

// Bookベーススキーマ
export const bookBaseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  google_books_id: z.string().nullable(),
  isbn: z.string().nullable(),
  subtitle: z.string().nullable(),
  thumbnail: z.string().nullable(),
  authors: z.array(z.string()),
  user_id: z.number(),
  category: categorySchema.optional(),
  tags: z.array(tagSchema),
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
export const bookSchema = bookBaseSchema;

// Book詳細データのバリデーションスキーマ(APIレスポンス用)
export const bookDetailSchema = bookSchema.extend({
  lists: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      public: z.boolean(),
    }),
  ),
  list_books: z.array(listBookSchema),
  cards: z.array(cardSchema),
});

// Bookのバリデーションスキーマ(フォーム用)
export const bookFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'タイトルを入力してください' })
    .max(255, { message: 'タイトルは255文字以内で入力してください' }),
  subtitle: z.string().optional(),
  thumbnail: z.string().optional(),
  authors: z.array(z.string()).optional(),
  description: z.string().optional(),
  category_id: z.number().optional(),
  tag_ids: z.number().array().optional(),
  google_books_id: z.string().optional(),
  isbn: z.string().optional(),
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
