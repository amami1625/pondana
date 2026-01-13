import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createMockUser } from '@/test/factories';
import { fetchProfile } from './fetchProfile';

describe('fetchProfile', () => {
  describe('成功時', () => {
    it('プロフィールデータを正しく取得できる', async () => {
      const result = await fetchProfile();

      expect(result.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(result.name).toBe('テストユーザー');
      expect(result.supabase_uid).toBe('1');
    });

    it('avatar_urlがnullでも正しく取得できる', async () => {
      // avatar_urlがnullのレスポンスを返すようにオーバーライド
      server.use(
        http.get('/api/profiles', () => {
          return HttpResponse.json(createMockUser({ avatar_url: null }));
        }),
      );

      const result = await fetchProfile();

      expect(result.avatar_url).toBeNull();
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      // 404エラーを返すようにオーバーライド
      server.use(
        http.get('/api/profiles', () => {
          return HttpResponse.json(
            { code: 'NOT_FOUND', error: 'プロフィール情報の取得に失敗しました' },
            { status: 404 },
          );
        }),
      );

      await expect(fetchProfile()).rejects.toThrow('プロフィール情報の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      // エラーメッセージなしの500エラーを返すようにオーバーライド
      server.use(
        http.get('/api/profiles', () => {
          return HttpResponse.json({}, { status: 500 });
        }),
      );

      await expect(fetchProfile()).rejects.toThrow('エラーが発生しました。もう一度お試しください');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      // ネットワークエラーをシミュレート
      server.use(
        http.get('/api/profiles', () => {
          return HttpResponse.error();
        }),
      );

      await expect(fetchProfile()).rejects.toThrow('ネットワークエラーが発生しました');
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      // 不正なデータ形式を返すようにオーバーライド
      server.use(
        http.get('/api/profiles', () => {
          return HttpResponse.json({ invalid: 'data' });
        }),
      );

      await expect(fetchProfile()).rejects.toThrow();
    });
  });
});
