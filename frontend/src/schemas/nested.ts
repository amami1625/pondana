import { z } from 'zod';
import { bookBaseSchema } from './book';
import { authorSchema } from './author';

// リストに追加された本（GET /lists/:id の books）
// Rails API は books に category と authors のみを含める
export const addedBookSchema = bookBaseSchema.extend({
  authors: authorSchema.array(),
});

// 本に追加されたリスト（GET /books/:id の lists）
// listBaseSchemaから必要なフィールドのみを定義（循環参照を避けるため）
export const addedListSchema = z.object({
  id: z.number(),
  name: z.string(),
  public: z.boolean(),
});

export type AddedBook = z.infer<typeof addedBookSchema>;
export type AddedList = z.infer<typeof addedListSchema>;
