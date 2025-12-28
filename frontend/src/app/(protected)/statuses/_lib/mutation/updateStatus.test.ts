import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { updateStatus } from './updateStatus';
import { STATUSES_ERROR_MESSAGES } from '@/constants/errorMessages';

describe('updateStatus', () => {
  const mockStatusData = {
    id: 1,
    name: '更新後ステータス',
  };

  it('ステータスを更新できる', async () => {
    const result = await updateStatus(mockStatusData);

    expect(result.id).toBe(1);
    expect(result.name).toBe('更新後ステータス');
  });

  it('更新に失敗した場合はUPDATE_FAILEDエラーを返す', async () => {
    server.use(
      http.put('/api/statuses/:id', () => {
        return HttpResponse.json(
          {
            code: 'UPDATE_FAILED',
            error: 'ステータスの更新に失敗しました',
          },
          { status: 422 },
        );
      }),
    );

    await expect(updateStatus(mockStatusData)).rejects.toThrow(
      STATUSES_ERROR_MESSAGES.UPDATE_FAILED,
    );
  });

  it('404エラー時にNOT_FOUNDエラーを返す', async () => {
    server.use(
      http.put('/api/statuses/:id', () => {
        return HttpResponse.json(
          {
            code: 'NOT_FOUND',
            error: 'ステータスの取得に失敗しました',
          },
          { status: 404 },
        );
      }),
    );

    await expect(updateStatus(mockStatusData)).rejects.toThrow(STATUSES_ERROR_MESSAGES.NOT_FOUND);
  });

  it('ネットワークエラー時にNETWORK_ERRORを返す', async () => {
    server.use(
      http.put('/api/statuses/:id', () => {
        return HttpResponse.error();
      }),
    );

    await expect(updateStatus(mockStatusData)).rejects.toThrow(
      STATUSES_ERROR_MESSAGES.NETWORK_ERROR,
    );
  });

  it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
    server.use(
      http.put('/api/statuses/:id', () => {
        return HttpResponse.json(
          {
            code: 'SOME_UNKNOWN_ERROR',
            error: 'Some unknown error',
          },
          { status: 500 },
        );
      }),
    );

    await expect(updateStatus(mockStatusData)).rejects.toThrow(
      STATUSES_ERROR_MESSAGES.UNKNOWN_ERROR,
    );
  });
});
