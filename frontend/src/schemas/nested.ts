import { z } from 'zod';
import { bookSchema } from './book';
import { listBaseSchema } from './list';

// リストに追加された本（GET /lists/:id の books）
export const addedBookSchema = bookSchema;

// 本に追加されたリスト（GET /books/:id の lists）
export const addedListSchema = listBaseSchema.pick({
  id: true,
  name: true,
  public: true,
});

export type AddedBook = z.infer<typeof addedBookSchema>;
export type AddedList = z.infer<typeof addedListSchema>;
