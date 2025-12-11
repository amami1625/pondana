import { z } from 'zod';
import { listBookSchema } from '@/schemas/listBooks';
import { bookBaseSchema } from '@/schemas/book';

// Listベーススキーマ
export const listBaseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  user_id: z.number(),
  public: z.boolean(),
  books_count: z.number().optional(),
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

// List一覧データのバリデーションスキーマ(APIレスポンス用)
export const listSchema = listBaseSchema;

// List詳細データのバリデーションスキーマ(APIレスポンス用)
export const listDetailSchema = listSchema.extend({
  books: z.array(
    z.object({
      ...bookBaseSchema.shape,
    }),
  ),
  list_books: z.array(listBookSchema),
});

// Listのバリデーションスキーマ(フォーム用)
export const listFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'リスト名を入力してください' })
    .max(255, { message: 'リスト名は255文字以内で入力してください' }),
  description: z.string().optional(),
  public: z.boolean(),
});

export type ListBase = z.infer<typeof listBaseSchema>;
export type List = z.infer<typeof listSchema>;
export type ListDetail = z.infer<typeof listDetailSchema>;
export type ListFormData = z.infer<typeof listFormSchema>;

// リストに追加された本の型
export type AddedBook = ListDetail['books'][number];
