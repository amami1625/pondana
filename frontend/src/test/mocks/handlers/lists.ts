import { createMockList, createMockListBase, createMockListItem } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { http, HttpResponse } from 'msw';

export const listsHandlers = [
  // GET - リスト一覧取得（Rails indexアクションに対応 - books_count含む）
  http.get('/api/lists', () => {
    return HttpResponse.json([
      createMockListItem({ name: 'テストリストA', books_count: 5 }),
      createMockListItem({ name: 'テストリストB', books_count: 3 }),
    ]);
  }),

  // GET - リスト詳細取得（Rails showアクションに対応 - books, list_books, user含む）
  http.get('/api/lists/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json(
      createMockList({
        id: createTestUuid(id),
        name: 'テストリスト',
      }),
    );
  }),

  // POST - リスト作成（Rails createアクションに対応 - 基本フィールドのみ）
  http.post('/api/lists', () => {
    return HttpResponse.json(
      createMockListBase({
        name: 'テストリスト',
        description: 'テスト説明',
        public: true,
      }),
      { status: 201 },
    );
  }),

  // PUT - リスト更新（Rails updateアクションに対応 - 基本フィールドのみ）
  http.put('/api/lists/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json(
      createMockListBase({
        id: createTestUuid(id),
        name: '更新されたリスト',
        description: '更新された説明',
        public: false,
      }),
    );
  }),

  // DELETE - リスト削除（Rails destroyアクションに対応 - 204 No Content）
  http.delete('/api/lists/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
