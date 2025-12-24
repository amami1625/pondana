# 設計パターンとガイドライン

## フロントエンド設計パターン

### 1. Server-Client Component分離パターン

**原則**: データフェッチはServer Component、インタラクションはClient Component

**実装例**:
```typescript
// app/(protected)/users/[id]/following/page.tsx（Server Component）
export default async function FollowingPage({ params }: Props) {
  const { id } = await params;
  const queryClient = createServerQueryClient();

  // サーバー側でデータをプリフェッチ
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.following(id),
    queryFn: async () => {
      const data = await authenticatedRequest(`/users/${id}/following`);
      return userSchema.array().parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FollowingClient id={id} />
    </HydrationBoundary>
  );
}

// _components/clients/FollowingClient.tsx（Client Component）
'use client';

export default function FollowingClient({ id }: FollowingClientProps) {
  const { data: following } = useFollowing(id); // キャッシュから取得
  // UIレンダリング
}
```

### 2. カスタムフックパターン

**原則**: データフェッチロジックをカスタムフックに分離

**ディレクトリ構造**:
```
_hooks/
├── useFollowMutations.ts    # Mutation（データ更新）
├── useFollowStatus.ts       # Query（状態取得）
├── useFollowers.ts          # Query（一覧取得）
└── useFollowing.ts          # Query（一覧取得）
```

**実装例**:
```typescript
// useFollowMutations.ts
export function useFollowMutations(userId: string) {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => {
      // 関連するクエリキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.users.followStatus(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
    },
  });

  return {
    follow: followMutation.mutate,
    isLoading: followMutation.isPending,
  };
}
```

### 3. データフェッチ関数の分離（_lib/）

**原則**: フェッチロジックを再利用可能な関数として分離

**実装例**:
```typescript
// _lib/fetchFollowing.ts
export async function fetchFollowing(userId: string): Promise<User[]> {
  const response = await fetch(`/api/users/${userId}/following`);
  if (!response.ok) {
    throw new Error('フォロー中のユーザー一覧の取得に失敗しました');
  }
  const data = await response.json();
  return userSchema.array().parse(data); // Zodでバリデーション
}
```

### 4. Zodスキーマバリデーション

**原則**: すべてのAPI レスポンスをZodスキーマで検証

**実装パターン**:
```typescript
// schemas/user.ts
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  avatar_url: z.string().nullable(),
  // ...
});

export type User = z.infer<typeof userSchema>;

// 配列のバリデーション
userSchema.array().parse(data); // ✅ 推奨
```

### 5. React Query キャッシュ管理

**原則**: クエリキーを一元管理し、キャッシュ無効化を適切に行う

**実装例**:
```typescript
// constants/queryKeys.ts
export const queryKeys = {
  users: {
    detail: (id: string) => ['users', 'detail', id] as const,
    followStatus: (id: string) => ['users', 'followStatus', id] as const,
    following: (id: string) => ['users', 'following', id] as const,
    followers: (id: string) => ['users', 'followers', id] as const,
  },
};

// キャッシュ無効化
queryClient.invalidateQueries({ queryKey: queryKeys.users.followStatus(userId) });
```

### 6. API Routes（プロキシパターン）

**原則**: フロントエンドからバックエンドへの直接アクセスを避け、API Routesを経由

**理由**:
- 認証トークンの安全な管理
- CORS問題の回避
- バックエンドURLの隠蔽

**実装例**:
```typescript
// app/api/users/[id]/follow/route.ts
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await authenticatedRequest(`/users/${id}/follow`, {
    method: 'POST',
  });
  return NextResponse.json(data, { status: 201 });
}
```

### 7. コンポーネント分類

**ディレクトリ構造による分類**:
```
_components/
├── actions/      # アクションコンポーネント（ボタン、フォームなど）
├── clients/      # クライアントページコンポーネント
└── display/      # 表示専用コンポーネント
    └── view/     # ビューコンポーネント
```

### 8. 絶対パスインポート

**原則**: `@/` プレフィックスを使用し、相対パスを避ける

```typescript
// ❌ 避ける
import FollowButton from '../../_components/actions/FollowButton';

// ✅ 推奨
import FollowButton from '@/app/(protected)/users/_components/actions/FollowButton';
```

## バックエンド設計パターン

### 1. RESTful API設計

**エンドポイント例**:
```
GET    /api/v1/users/:id              # ユーザー詳細
GET    /api/v1/users/:id/following    # フォロー中一覧
GET    /api/v1/users/:id/followers    # フォロワー一覧
GET    /api/v1/users/:id/follow_status # フォロー状態
POST   /api/v1/users/:id/follow       # フォロー
DELETE /api/v1/users/:id/follow       # アンフォロー
```

### 2. 自己参照多対多関連（フォロー機能）

**実装パターン**:
```ruby
# models/user.rb
class User < ApplicationRecord
  # フォローする側
  has_many :active_follows, class_name: 'Follow', foreign_key: 'follower_id', dependent: :destroy
  has_many :following, through: :active_follows, source: :followed

  # フォローされる側
  has_many :passive_follows, class_name: 'Follow', foreign_key: 'followed_id', dependent: :destroy
  has_many :followers, through: :passive_follows, source: :follower

  def stats
    {
      public_books: books.where(public: true).count,
      public_lists: lists.where(public: true).count,
      following_count: following.count,
      followers_count: followers.count
    }
  end
end
```

### 3. JWT認証

**実装パターン**:
```ruby
# controllers/application_controller.rb
class ApplicationController < ActionController::API
  before_action :authenticate_user

  private

  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last
    # JWTトークン検証
  end
end
```

## 共通ガイドライン

### エラーハンドリング
- フロントエンド: try-catch + react-hot-toast
- バックエンド: rescue + JSONエラーレスポンス

### 型安全性
- TypeScript strict mode
- Zodバリデーション
- Rails型定義（Sorbet未使用）

### パフォーマンス
- React Query キャッシュ活用
- Server-side prefetch
- 画像最適化（Next.js Image）

### セキュリティ
- JWT認証
- CORS設定
- 環境変数管理（.env）
- SQL インジェクション対策（ActiveRecord）
