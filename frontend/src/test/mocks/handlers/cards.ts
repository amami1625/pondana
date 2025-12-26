import { createMockCard } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { http, HttpResponse } from 'msw';

export const cardsHandlers = [
  // GET - カード詳細取得（成功）
  http.get('/api/cards/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json(
      createMockCard({
        id: createTestUuid(id),
        title: 'テストカード',
      }),
    );
  }),

  // GET - カード一覧取得（成功）
  http.get('/api/cards', () => {
    return HttpResponse.json({
      books: [
        {
          book: { id: createTestUuid(1), title: 'テスト本A' },
          cards: [
            {
              id: createTestUuid(1),
              title: 'テストカード',
              content: 'テスト本文',
              book_id: createTestUuid(1),
              created_at: '2025-01-01T00:00:00Z',
              updated_at: '2025-01-01T00:00:00Z',
            },
          ],
        },
        {
          book: { id: createTestUuid(2), title: 'テスト本B' },
          cards: [],
        },
      ],
    });
  }),

  // POST - カード作成（成功）
  http.post('/api/books/:bookId/cards', () => {
    return HttpResponse.json(
      createMockCard({
        title: 'テストカード',
        content: 'テスト詳細',
      }),
      { status: 201 },
    );
  }),

  // PUT - カード更新（成功）
  http.put('/api/books/:bookId/cards/:cardId', ({ params }) => {
    const { bookId, cardId } = params;
    return HttpResponse.json(
      createMockCard({
        book_id: createTestUuid(bookId),
        title: 'テストカード',
        content: 'テスト詳細',
        id: createTestUuid(cardId),
      }),
      { status: 200 },
    );
  }),

  // DELETE - カード削除（成功）
  http.delete('/api/books/:bookId/cards/:cardId', () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
