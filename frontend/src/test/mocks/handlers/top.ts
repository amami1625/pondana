import { createMockBook, createMockList, createMockCard } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { http, HttpResponse } from 'msw';

/**
 * トップページ関連のAPIモックハンドラー
 */
export const topHandlers = [
  // トップページデータ取得
  http.get('/api/top', () => {
    return HttpResponse.json({
      recent_books: [
        createMockBook({ id: createTestUuid(1), title: '最近の本1' }),
        createMockBook({ id: createTestUuid(2), title: '最近の本2' }),
      ],
      recent_lists: [
        createMockList({ id: createTestUuid(1), name: '最近のリスト1', books_count: 3 }),
        createMockList({ id: createTestUuid(2), name: '最近のリスト2', books_count: 5 }),
      ],
      recent_cards: [
        createMockCard({
          id: createTestUuid(1),
          title: '最近のカード1',
          book: { title: '本のタイトル1' },
        }),
        createMockCard({
          id: createTestUuid(2),
          title: '最近のカード2',
          book: { title: '本のタイトル2' },
        }),
      ],
    });
  }),
];
