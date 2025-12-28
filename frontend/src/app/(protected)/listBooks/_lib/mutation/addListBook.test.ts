import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { addListBook } from './addListBook';
import { createTestUuid } from '@/test/helpers';
import { createMockListBook } from '@/test/factories';
import { LIST_BOOKS_ERROR_MESSAGES } from '@/constants/errorMessages';

describe('addListBook', () => {
  it('リストに本を追加できる', async () => {
    const listId = createTestUuid(1);
    const bookId = createTestUuid(2);
    const mockListBook = createMockListBook({ list_id: listId, book_id: bookId });

    server.use(
      http.post('/api/list_books', async () => {
        return HttpResponse.json(mockListBook, { status: 201 });
      }),
    );

    const result = await addListBook({ list_id: listId, book_id: bookId });

    expect(result).toEqual(mockListBook);
  });

  it('既に追加済みの場合はALREADY_EXISTSエラーを返す', async () => {
    const listId = createTestUuid(1);
    const bookId = createTestUuid(2);

    server.use(
      http.post('/api/list_books', async () => {
        return HttpResponse.json(
          {
            code: 'ALREADY_EXISTS',
            error: '既にこの本はリストに追加されています',
          },
          { status: 422 },
        );
      }),
    );

    await expect(addListBook({ list_id: listId, book_id: bookId })).rejects.toThrow(
      LIST_BOOKS_ERROR_MESSAGES.ALREADY_EXISTS,
    );
  });

  it('リストまたは本が見つからない場合はNOT_FOUNDエラーを返す', async () => {
    const listId = createTestUuid(1);
    const bookId = createTestUuid(2);

    server.use(
      http.post('/api/list_books', async () => {
        return HttpResponse.json(
          {
            code: 'NOT_FOUND',
            error: 'リストまたは本が見つかりませんでした',
          },
          { status: 404 },
        );
      }),
    );

    await expect(addListBook({ list_id: listId, book_id: bookId })).rejects.toThrow(
      LIST_BOOKS_ERROR_MESSAGES.NOT_FOUND,
    );
  });

  it('追加に失敗した場合はADD_FAILEDエラーを返す', async () => {
    const listId = createTestUuid(1);
    const bookId = createTestUuid(2);

    server.use(
      http.post('/api/list_books', async () => {
        return HttpResponse.json(
          {
            code: 'ADD_FAILED',
            error: 'リストへの本の追加に失敗しました',
          },
          { status: 422 },
        );
      }),
    );

    await expect(addListBook({ list_id: listId, book_id: bookId })).rejects.toThrow(
      LIST_BOOKS_ERROR_MESSAGES.ADD_FAILED,
    );
  });

  it('ネットワークエラーの場合はNETWORK_ERRORを返す', async () => {
    const listId = createTestUuid(1);
    const bookId = createTestUuid(2);

    server.use(
      http.post('/api/list_books', async () => {
        return HttpResponse.error();
      }),
    );

    await expect(addListBook({ list_id: listId, book_id: bookId })).rejects.toThrow(
      LIST_BOOKS_ERROR_MESSAGES.NETWORK_ERROR,
    );
  });

  it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
    const listId = createTestUuid(1);
    const bookId = createTestUuid(2);

    server.use(
      http.post('/api/list_books', async () => {
        return HttpResponse.json(
          {
            code: 'SOME_UNKNOWN_ERROR',
            error: 'Some unknown error',
          },
          { status: 500 },
        );
      }),
    );

    await expect(addListBook({ list_id: listId, book_id: bookId })).rejects.toThrow(
      LIST_BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR,
    );
  });
});
