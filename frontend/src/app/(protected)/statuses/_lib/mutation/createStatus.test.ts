import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createStatus } from './createStatus';
import { STATUSES_ERROR_MESSAGES } from '@/constants/errorMessages';

describe('createStatus', () => {
  const mockStatusData = {
    name: 'テストステータス',
  };

  it('ステータスを作成できる', async () => {
    const result = await createStatus(mockStatusData);

    expect(result.id).toBe(1);
    expect(result.name).toBe('テストステータス');
  });

  it('作成に失敗した場合はCREATE_FAILEDエラーを返す', async () => {
    server.use(
      http.post('/api/statuses', () => {
        return HttpResponse.json(
          {
            code: 'CREATE_FAILED',
            error: 'ステータスの作成に失敗しました',
          },
          { status: 422 },
        );
      }),
    );

    await expect(createStatus(mockStatusData)).rejects.toThrow(
      STATUSES_ERROR_MESSAGES.CREATE_FAILED,
    );
  });

  it('404エラー時にNOT_FOUNDエラーを返す', async () => {
    server.use(
      http.post('/api/statuses', () => {
        return HttpResponse.json(
          {
            code: 'NOT_FOUND',
            error: 'ステータスの取得に失敗しました',
          },
          { status: 404 },
        );
      }),
    );

    await expect(createStatus(mockStatusData)).rejects.toThrow(STATUSES_ERROR_MESSAGES.NOT_FOUND);
  });

  it('ネットワークエラー時にNETWORK_ERRORを返す', async () => {
    server.use(
      http.post('/api/statuses', () => {
        return HttpResponse.error();
      }),
    );

    await expect(createStatus(mockStatusData)).rejects.toThrow(
      STATUSES_ERROR_MESSAGES.NETWORK_ERROR,
    );
  });

  it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
    server.use(
      http.post('/api/statuses', () => {
        return HttpResponse.json(
          {
            code: 'SOME_UNKNOWN_ERROR',
            error: 'Some unknown error',
          },
          { status: 500 },
        );
      }),
    );

    await expect(createStatus(mockStatusData)).rejects.toThrow(
      STATUSES_ERROR_MESSAGES.UNKNOWN_ERROR,
    );
  });
});
