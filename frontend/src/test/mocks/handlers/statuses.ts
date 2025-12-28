import { createMockStatus } from '@/test/factories/status';
import { http, HttpResponse } from 'msw';

export const statusesHandlers = [
  // GET - ステータス一覧取得
  http.get('/api/statuses', () => {
    return HttpResponse.json([
      createMockStatus({ id: 1, name: 'テストステータスA' }),
      createMockStatus({ id: 2, name: 'テストステータスB' }),
    ]);
  }),

  // POST - ステータス作成
  http.post('/api/statuses', async ({ request }) => {
    const body = await request.json();
    const { name } = body as { name: string };

    return HttpResponse.json(
      createMockStatus({
        id: 1,
        name,
      }),
      { status: 201 },
    );
  }),

  // PUT - ステータス更新
  http.put('/api/statuses/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const { name } = body as { name: string };

    return HttpResponse.json(
      createMockStatus({
        id: Number(id),
        name,
      }),
    );
  }),

  // DELETE - ステータス削除
  http.delete('/api/statuses/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
