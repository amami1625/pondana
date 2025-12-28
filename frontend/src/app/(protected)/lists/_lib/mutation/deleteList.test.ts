import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { LISTS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { deleteList } from './deleteList';

describe('deleteList', () => {
  describe('成功時', () => {
    it('リストを削除できる', async () => {
      server.use(
        http.delete('/api/lists/:id', () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );

      await expect(deleteList(createTestUuid(1))).resolves.toBeUndefined();
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.delete('/api/lists/:id', () => {
          return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
        }),
      );

      await expect(deleteList(createTestUuid(1))).rejects.toThrow(LISTS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.delete('/api/lists/:id', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(deleteList(createTestUuid(1))).rejects.toThrow(
        LISTS_ERROR_MESSAGES.UNKNOWN_ERROR,
      );
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      server.use(
        http.delete('/api/lists/:id', () => {
          return HttpResponse.error();
        }),
      );

      await expect(deleteList(createTestUuid(1))).rejects.toThrow(
        LISTS_ERROR_MESSAGES.NETWORK_ERROR,
      );
    });
  });
});
