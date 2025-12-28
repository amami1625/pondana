import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { updateTag } from './updateTag';
import { TAGS_ERROR_MESSAGES } from '@/constants/errorMessages';

describe('updateTag', () => {
  const mockUpdateData = {
    id: 1,
    name: '更新されたタグ',
  };

  it('タグを更新できる', async () => {
    const result = await updateTag(mockUpdateData);

    expect(result.id).toBe(1);
    expect(result.name).toBe('更新されたタグ');
  });

  it('更新に失敗した場合はUPDATE_FAILEDエラーを返す', async () => {
    server.use(
      http.put('/api/tags/:id', () => {
        return HttpResponse.json(
          {
            code: 'UPDATE_FAILED',
            error: 'タグの更新に失敗しました',
          },
          { status: 422 },
        );
      }),
    );

    await expect(updateTag(mockUpdateData)).rejects.toThrow(TAGS_ERROR_MESSAGES.UPDATE_FAILED);
  });

  it('404エラー時にNOT_FOUNDエラーを返す', async () => {
    server.use(
      http.put('/api/tags/:id', () => {
        return HttpResponse.json(
          {
            code: 'NOT_FOUND',
            error: 'タグが見つかりませんでした',
          },
          { status: 404 },
        );
      }),
    );

    await expect(updateTag(mockUpdateData)).rejects.toThrow(TAGS_ERROR_MESSAGES.NOT_FOUND);
  });

  it('ネットワークエラー時にNETWORK_ERRORを返す', async () => {
    server.use(
      http.put('/api/tags/:id', () => {
        return HttpResponse.error();
      }),
    );

    await expect(updateTag(mockUpdateData)).rejects.toThrow(TAGS_ERROR_MESSAGES.NETWORK_ERROR);
  });

  it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
    server.use(
      http.put('/api/tags/:id', () => {
        return HttpResponse.json(
          {
            code: 'SOME_UNKNOWN_ERROR',
            error: 'Some unknown error',
          },
          { status: 500 },
        );
      }),
    );

    await expect(updateTag(mockUpdateData)).rejects.toThrow(TAGS_ERROR_MESSAGES.UNKNOWN_ERROR);
  });
});
