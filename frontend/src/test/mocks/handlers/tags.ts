import { createMockTag } from '@/test/factories/tag';
import { http, HttpResponse } from 'msw';

export const tagsHandlers = [
  // GET - タグ一覧取得
  http.get('/api/tags', () => {
    return HttpResponse.json([
      createMockTag({ id: 1, name: 'テストタグA' }),
      createMockTag({ id: 2, name: 'テストタグB' }),
    ]);
  }),

  // POST - タグ作成
  http.post('/api/tags', async ({ request }) => {
    const body = await request.json();
    const { name } = body as { name: string };

    return HttpResponse.json(
      createMockTag({
        id: 1,
        name,
      }),
      { status: 201 }
    );
  }),

  // PUT - タグ更新
  http.put('/api/tags/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const { name } = body as { name: string };

    return HttpResponse.json(
      createMockTag({
        id: Number(id),
        name,
      })
    );
  }),

  // DELETE - タグ削除
  http.delete('/api/tags/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
