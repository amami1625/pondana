import { z } from 'zod';

// ListBookのバリデーションスキーマ(フォーム用)
export const listBookFormSchema = z.object({
  list_id: z.uuid(),
  book_id: z.uuid(),
});

// ListBookのスキーマ(APIレスポンス用)
export const listBookSchema = listBookFormSchema.extend({
  id: z.number().int().positive(),
});

export type ListBook = z.infer<typeof listBookSchema>;
export type ListBookFormData = z.infer<typeof listBookFormSchema>;
