import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { removeListBook } from './removeListBook';
import { LIST_BOOKS_ERROR_MESSAGES } from '@/constants/errorMessages';

describe('removeListBook', () => {
  it('リストから本を削除できる', async () => {
    server.use(
      http.delete('/api/list_books/:id', () => {
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await expect(removeListBook({ id: 1 })).resolves.toBeUndefined();
  });

  it('リストまたは本が見つからない場合はNOT_FOUNDエラーを返す', async () => {
    server.use(
      http.delete('/api/list_books/:id', () => {
        return HttpResponse.json(
          {
            code: 'NOT_FOUND',
            error: 'リストまたは本が見つかりませんでした',
          },
          { status: 404 },
        );
      }),
    );

    await expect(removeListBook({ id: 1 })).rejects.toThrow(LIST_BOOKS_ERROR_MESSAGES.NOT_FOUND);
  });

  it('削除に失敗した場合はREMOVE_FAILEDエラーを返す', async () => {
    server.use(
      http.delete('/api/list_books/:id', () => {
        return HttpResponse.json(
          {
            code: 'REMOVE_FAILED',
            error: 'リストからの本の削除に失敗しました',
          },
          { status: 422 },
        );
      }),
    );

    await expect(removeListBook({ id: 1 })).rejects.toThrow(
      LIST_BOOKS_ERROR_MESSAGES.REMOVE_FAILED,
    );
  });

  it('ネットワークエラーの場合はNETWORK_ERRORを返す', async () => {
    server.use(
      http.delete('/api/list_books/:id', () => {
        return HttpResponse.error();
      }),
    );

    await expect(removeListBook({ id: 1 })).rejects.toThrow(
      LIST_BOOKS_ERROR_MESSAGES.NETWORK_ERROR,
    );
  });

  it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
    server.use(
      http.delete('/api/list_books/:id', () => {
        return HttpResponse.json(
          {
            code: 'SOME_UNKNOWN_ERROR',
            error: 'Some unknown error',
          },
          { status: 500 },
        );
      }),
    );

    await expect(removeListBook({ id: 1 })).rejects.toThrow(
      LIST_BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR,
    );
  });
});
