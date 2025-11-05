import { z } from 'zod';
import { addedBookSchema } from './nested';
import { listBookSchema } from './listBooks';

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
export const listSchema = listBaseSchema.extend({
  book_ids: z.number().array(),
});

// List詳細データのバリデーションスキーマ(APIレスポンス用)
export const listDetailSchema = listSchema.extend({
  books: z.array(addedBookSchema),
  list_books: z.array(listBookSchema),
});

// Listのバリデーションスキーマ(フォーム用)
export const listFormSchema = z.object({
  id: z.number().optional(),
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
