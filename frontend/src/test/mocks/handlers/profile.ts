import { createMockUser } from '@/test/factories/user';
import { http, HttpResponse } from 'msw';

export const profileHandlers = [
  // GET - プロフィール取得
  http.get('/api/profiles', () => {
    return HttpResponse.json(createMockUser());
  }),

  // PUT - プロフィール更新
  http.put('/api/profiles', async ({ request }) => {
    const body = await request.json();
    const { name, avatar_url, avatar_public_id } = body as {
      name?: string;
      avatar_url?: string | null;
      avatar_public_id?: string | null;
    };

    return HttpResponse.json(
      createMockUser({
        name: name ?? 'テストユーザー',
        avatar_url: avatar_url ?? null,
        avatar_public_id: avatar_public_id ?? null,
      }),
    );
  }),
];
