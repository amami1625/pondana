import { http, HttpResponse } from 'msw';
import { createMockListBook } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';

export const listBooksHandlers = [
  // POST /api/list_books - リストに本を追加
  http.post('/api/list_books', async ({ request }) => {
    const body = await request.json();
    const { list_id, book_id } = body as { list_id: string; book_id: string };

    // 既に存在するかのチェック（テストでは特定のIDの組み合わせでシミュレート）
    if (list_id === createTestUuid(999) && book_id === createTestUuid(999)) {
      return HttpResponse.json(
        {
          code: 'ALREADY_EXISTS',
          error: '既にこの本はリストに追加されています',
        },
        { status: 422 },
      );
    }

    const listBook = createMockListBook({
      list_id,
      book_id,
    });

    return HttpResponse.json(listBook, { status: 201 });
  }),

  // DELETE /api/list_books/:id - リストから本を削除
  http.delete('/api/list_books/:id', ({ params }) => {
    const { id } = params;

    // 存在しないIDの場合
    if (id === '99999') {
      return HttpResponse.json(
        {
          code: 'NOT_FOUND',
          error: 'リストまたは本が見つかりませんでした',
        },
        { status: 404 },
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
