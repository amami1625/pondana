import { createMockBook } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { http, HttpResponse } from 'msw';

export const booksHandlers = [
  // GET - 書籍詳細取得（成功）
  http.get('/api/books/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json(
      createMockBook({
        id: createTestUuid(Number(id)),
        title: 'テスト本',
        authors: ['テスト著者'],
      }),
    );
  }),
];
