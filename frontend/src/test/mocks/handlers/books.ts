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

  // GET - 書籍一覧取得（成功）
  http.get('/api/books', () => {
    return HttpResponse.json([
      createMockBook({
        id: createTestUuid(Number(1)),
        title: 'テスト本A',
        authors: ['テスト著者A'],
      }),
      createMockBook({
        id: createTestUuid(Number(2)),
        title: 'テスト本B',
        authors: ['テスト著者B'],
      }),
    ]);
  }),

  // POST - 書籍新規作成（成功）
  http.post('/api/books', () => {
    return HttpResponse.json(
      createMockBook({
        id: createTestUuid(Number(1)),
        title: 'テスト本',
        authors: ['テスト著者'],
      }),
      { status: 201 },
    );
  }),

  // PUT - 書籍更新（成功）
  http.put('/api/books/:id', () => {
    return HttpResponse.json(
      createMockBook({
        id: createTestUuid(Number(1)),
        title: 'テスト本',
        authors: ['テスト著者'],
      }),
      { status: 200 },
    );
  }),

  // DELETE - 書籍削除（成功）
  http.delete('/api/books/:id', () => {
    return HttpResponse.json({}, { status: 200 });
  }),
];
