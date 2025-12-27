import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { deleteStatus } from './deleteStatus';
import { STATUSES_ERROR_MESSAGES } from '../constants/errorMessages';

describe('deleteStatus', () => {
  it('ステータスを削除できる', async () => {
    await expect(deleteStatus(1)).resolves.toBeUndefined();
  });

  it('削除に失敗した場合はDELETE_FAILEDエラーを返す', async () => {
    server.use(
      http.delete('/api/statuses/:id', () => {
        return HttpResponse.json(
          {
            code: 'DELETE_FAILED',
            error: 'ステータスの削除に失敗しました',
          },
          { status: 422 },
        );
      }),
    );

    await expect(deleteStatus(1)).rejects.toThrow(STATUSES_ERROR_MESSAGES.DELETE_FAILED);
  });

  it('404エラー時にNOT_FOUNDエラーを返す', async () => {
    server.use(
      http.delete('/api/statuses/:id', () => {
        return HttpResponse.json(
          {
            code: 'NOT_FOUND',
            error: 'ステータスの取得に失敗しました',
          },
          { status: 404 },
        );
      }),
    );

    await expect(deleteStatus(1)).rejects.toThrow(STATUSES_ERROR_MESSAGES.NOT_FOUND);
  });

  it('ネットワークエラー時にNETWORK_ERRORを返す', async () => {
    server.use(
      http.delete('/api/statuses/:id', () => {
        return HttpResponse.error();
      }),
    );

    await expect(deleteStatus(1)).rejects.toThrow(STATUSES_ERROR_MESSAGES.NETWORK_ERROR);
  });

  it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
    server.use(
      http.delete('/api/statuses/:id', () => {
        return HttpResponse.json(
          {
            code: 'SOME_UNKNOWN_ERROR',
            error: 'Some unknown error',
          },
          { status: 500 },
        );
      }),
    );

    await expect(deleteStatus(1)).rejects.toThrow(STATUSES_ERROR_MESSAGES.UNKNOWN_ERROR);
  });
});
