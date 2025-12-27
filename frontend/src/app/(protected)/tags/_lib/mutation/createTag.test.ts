import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTag } from './createTag';
import { createMockTag } from '@/test/factories';
import { TAGS_ERROR_MESSAGES } from '../constants/errorMessages';

describe('createTag', () => {
  const mockTagData = {
    name: 'テストタグ',
  };

  it('タグを作成できる', async () => {
    const result = await createTag(mockTagData);

    expect(result.id).toBe(1);
    expect(result.name).toBe('テストタグ');
  });

  it('作成に失敗した場合はCREATE_FAILEDエラーを返す', async () => {
    server.use(
      http.post('/api/tags', () => {
        return HttpResponse.json(
          {
            code: 'CREATE_FAILED',
            error: 'タグの作成に失敗しました',
          },
          { status: 422 }
        );
      })
    );

    await expect(createTag(mockTagData)).rejects.toThrow(
      TAGS_ERROR_MESSAGES.CREATE_FAILED
    );
  });

  it('404エラー時にNOT_FOUNDエラーを返す', async () => {
    server.use(
      http.post('/api/tags', () => {
        return HttpResponse.json(
          {
            code: 'NOT_FOUND',
            error: 'タグの取得に失敗しました',
          },
          { status: 404 }
        );
      })
    );

    await expect(createTag(mockTagData)).rejects.toThrow(
      TAGS_ERROR_MESSAGES.NOT_FOUND
    );
  });

  it('ネットワークエラー時にNETWORK_ERRORを返す', async () => {
    server.use(
      http.post('/api/tags', () => {
        return HttpResponse.error();
      })
    );

    await expect(createTag(mockTagData)).rejects.toThrow(
      TAGS_ERROR_MESSAGES.NETWORK_ERROR
    );
  });

  it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
    server.use(
      http.post('/api/tags', () => {
        return HttpResponse.json(
          {
            code: 'SOME_UNKNOWN_ERROR',
            error: 'Some unknown error',
          },
          { status: 500 }
        );
      })
    );

    await expect(createTag(mockTagData)).rejects.toThrow(
      TAGS_ERROR_MESSAGES.UNKNOWN_ERROR
    );
  });
});
