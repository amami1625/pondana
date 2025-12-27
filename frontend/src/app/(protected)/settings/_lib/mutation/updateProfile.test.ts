import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { updateProfile } from './updateProfile';
import { PROFILE_ERROR_MESSAGES } from '../constants/errorMessages';

describe('updateProfile', () => {
  const mockProfileData = {
    name: '更新後ユーザー',
    avatar_url: 'https://example.com/avatar.png',
  };

  it('プロフィールを更新できる', async () => {
    const result = await updateProfile(mockProfileData);

    expect(result.name).toBe('更新後ユーザー');
    expect(result.avatar_url).toBe('https://example.com/avatar.png');
  });

  it('更新に失敗した場合はUPDATE_FAILEDエラーを返す', async () => {
    server.use(
      http.put('/api/profiles', () => {
        return HttpResponse.json(
          {
            code: 'UPDATE_FAILED',
            error: 'プロフィールの更新に失敗しました',
          },
          { status: 422 },
        );
      }),
    );

    await expect(updateProfile(mockProfileData)).rejects.toThrow(
      PROFILE_ERROR_MESSAGES.UPDATE_FAILED,
    );
  });

  it('404エラー時にNOT_FOUNDエラーを返す', async () => {
    server.use(
      http.put('/api/profiles', () => {
        return HttpResponse.json(
          {
            code: 'NOT_FOUND',
            error: 'プロフィール情報の取得に失敗しました',
          },
          { status: 404 },
        );
      }),
    );

    await expect(updateProfile(mockProfileData)).rejects.toThrow(
      PROFILE_ERROR_MESSAGES.NOT_FOUND,
    );
  });

  it('ネットワークエラー時にNETWORK_ERRORを返す', async () => {
    server.use(
      http.put('/api/profiles', () => {
        return HttpResponse.error();
      }),
    );

    await expect(updateProfile(mockProfileData)).rejects.toThrow(
      PROFILE_ERROR_MESSAGES.NETWORK_ERROR,
    );
  });

  it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
    server.use(
      http.put('/api/profiles', () => {
        return HttpResponse.json(
          {
            code: 'SOME_UNKNOWN_ERROR',
            error: 'Some unknown error',
          },
          { status: 500 },
        );
      }),
    );

    await expect(updateProfile(mockProfileData)).rejects.toThrow(
      PROFILE_ERROR_MESSAGES.UNKNOWN_ERROR,
    );
  });
});
