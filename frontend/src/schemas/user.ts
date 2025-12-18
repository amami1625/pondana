import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  supabase_uid: z.string(),
  name: z.string(),
  avatar_url: z.string().nullable(),
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

// ユーザー統計情報のスキーマ
export const userStatsSchema = z.object({
  public_books: z.number(),
  public_lists: z.number(),
});

// 統計情報を含むユーザー情報のスキーマ
export const userWithStatsSchema = userSchema.extend({
  stats: userStatsSchema,
});

// Userのバリデーションスキーマ(フォーム用)
export const userFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'ユーザー名を入力してください' })
    .max(50, { message: 'ユーザー名は50文字以内で入力してください' }),
  avatar_url: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;
export type UserStats = z.infer<typeof userStatsSchema>;
export type UserWithStats = z.infer<typeof userWithStatsSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;
