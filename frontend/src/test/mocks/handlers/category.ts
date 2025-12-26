import { http, HttpResponse } from 'msw';
import { createMockCategory } from '@/test/factories';

export const categoryHandlers = [
  // GET - カテゴリ一覧取得（成功）
  http.get('/api/categories', () => {
    return HttpResponse.json(
      [
        createMockCategory({ id: 1, name: 'テストカテゴリA' }),
        createMockCategory({ id: 2, name: 'テストカテゴリB' }),
      ],
      { status: 200 },
    );
  }),

  // POST - カテゴリ作成（成功）
  http.post('/api/categories', () => {
    return HttpResponse.json(createMockCategory({ id: 1, name: 'テストカテゴリ' }), {
      status: 201,
    });
  }),

  // PUT - カテゴリ更新（成功）
  http.put('/api/categories/:id', () => {
    return HttpResponse.json(createMockCategory({ id: 1, name: '更新されたカテゴリ' }), {
      status: 200,
    });
  }),

  // DELETE - カテゴリ削除（成功）
  http.delete('/api/categories/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
