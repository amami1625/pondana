import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { deleteTag } from './deleteTag';
import { TAGS_ERROR_MESSAGES } from '../constants/errorMessages';

describe('deleteTag', () => {
  it('タグを削除できる', async () => {
    await expect(deleteTag({ id: 1 })).resolves.toBeUndefined();
  });

  it('削除に失敗した場合はDELETE_FAILEDエラーを返す', async () => {
    server.use(
      http.delete('/api/tags/:id', () => {
        return HttpResponse.json(
          {
            code: 'DELETE_FAILED',
            error: 'タグの削除に失敗しました',
          },
          { status: 422 }
        );
      })
    );

    await expect(deleteTag({ id: 1 })).rejects.toThrow(
      TAGS_ERROR_MESSAGES.DELETE_FAILED
    );
  });

  it('404エラー時にNOT_FOUNDエラーを返す', async () => {
    server.use(
      http.delete('/api/tags/:id', () => {
        return HttpResponse.json(
          {
            code: 'NOT_FOUND',
            error: 'タグが見つかりませんでした',
          },
          { status: 404 }
        );
      })
    );

    await expect(deleteTag({ id: 1 })).rejects.toThrow(
      TAGS_ERROR_MESSAGES.NOT_FOUND
    );
  });

  it('ネットワークエラー時にNETWORK_ERRORを返す', async () => {
    server.use(
      http.delete('/api/tags/:id', () => {
        return HttpResponse.error();
      })
    );

    await expect(deleteTag({ id: 1 })).rejects.toThrow(
      TAGS_ERROR_MESSAGES.NETWORK_ERROR
    );
  });

  it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
    server.use(
      http.delete('/api/tags/:id', () => {
        return HttpResponse.json(
          {
            code: 'SOME_UNKNOWN_ERROR',
            error: 'Some unknown error',
          },
          { status: 500 }
        );
      })
    );

    await expect(deleteTag({ id: 1 })).rejects.toThrow(
      TAGS_ERROR_MESSAGES.UNKNOWN_ERROR
    );
  });
});
