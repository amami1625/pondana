import { z } from 'zod';
import { listBookSchema } from './listBooks';
import { bookBaseSchema } from './book';
import { authorSchema } from './author';

// Listベーススキーマ
export const listBaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  user_id: z.number(),
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

// List一覧データのバリデーションスキーマ(APIレスポンス用)
export const listSchema = listBaseSchema;

// List詳細データのバリデーションスキーマ(APIレスポンス用)
export const listDetailSchema = listSchema.extend({
  books: z.array(
    z.object({
      ...bookBaseSchema.shape,
      authors: authorSchema.array(),
    }),
  ),
  list_books: z.array(listBookSchema),
});

// Listのバリデーションスキーマ(フォーム用)
export const listFormSchema = z.object({
  name: z
    .string()
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
