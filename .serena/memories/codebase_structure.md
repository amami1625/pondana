# コードベース構造

## プロジェクトルート構造
```
my_graduation_project/
├── backend/           # Rails APIバックエンド
├── frontend/          # Next.jsフロントエンド
├── compose.yml        # Docker Compose設定
├── Makefile          # 開発コマンドのショートカット
├── README.md         # プロジェクト概要
├── .env              # 環境変数（gitignore）
└── .env.example      # 環境変数のサンプル
```

## バックエンド構造（Rails）
```
backend/
├── app/
│   ├── controllers/           # APIコントローラー
│   │   ├── application_controller.rb
│   │   └── api/
│   │       └── v1/           # API v1エンドポイント
│   │           ├── books_controller.rb
│   │           ├── users_controller.rb
│   │           ├── lists_controller.rb
│   │           ├── categories_controller.rb
│   │           └── ...
│   ├── models/               # データモデル
│   │   ├── user.rb
│   │   ├── book.rb
│   │   ├── list.rb
│   │   ├── category.rb
│   │   ├── tag.rb
│   │   ├── card.rb
│   │   ├── status.rb
│   │   └── follow.rb
│   ├── views/                # JSONビュー（Jbuilder）
│   ├── jobs/                 # バックグラウンドジョブ
│   └── mailers/              # メール送信
├── config/
│   ├── routes.rb             # ルーティング定義
│   ├── database.yml          # DB設定
│   ├── application.rb        # アプリケーション設定
│   └── initializers/         # 初期化設定
│       ├── cors.rb           # CORS設定
│       └── ...
├── db/
│   ├── migrate/              # マイグレーションファイル
│   └── seeds.rb              # シードデータ
├── test/                     # テスト（RSpec予定）
├── Gemfile                   # Ruby依存関係
└── Dockerfile                # Dockerイメージ定義
```

## フロントエンド構造（Next.js）
```
frontend/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (protected)/              # 認証必須ページ
│   │   │   ├── books/                # 書籍関連ページ
│   │   │   │   ├── _hooks/           # 書籍用カスタムhooks
│   │   │   │   ├── _lib/             # データフェッチ関数
│   │   │   │   ├── _components/      # 書籍用コンポーネント
│   │   │   │   ├── [id]/             # 書籍詳細ページ
│   │   │   │   ├── new/              # 書籍作成ページ
│   │   │   │   └── page.tsx          # 書籍一覧ページ
│   │   │   ├── users/                # ユーザー関連ページ
│   │   │   │   ├── _hooks/           # ユーザー用hooks
│   │   │   │   │   ├── useFollowMutations.ts
│   │   │   │   │   ├── useFollowStatus.ts
│   │   │   │   │   ├── useFollowers.ts
│   │   │   │   │   └── useFollowing.ts
│   │   │   │   ├── _lib/             # データフェッチ関数
│   │   │   │   │   ├── fetchFollowers.ts
│   │   │   │   │   └── fetchFollowing.ts
│   │   │   │   ├── _components/      # ユーザー用コンポーネント
│   │   │   │   │   ├── actions/      # アクション（ボタン等）
│   │   │   │   │   │   └── FollowButton.tsx
│   │   │   │   │   ├── clients/      # クライアントコンポーネント
│   │   │   │   │   │   ├── FollowersClient.tsx
│   │   │   │   │   │   └── FollowingClient.tsx
│   │   │   │   │   └── display/      # 表示コンポーネント
│   │   │   │   │       ├── FollowList.tsx
│   │   │   │   │       └── view/
│   │   │   │   │           ├── UserProfileView.tsx
│   │   │   │   │           ├── FollowersView.tsx
│   │   │   │   │           └── FollowingView.tsx
│   │   │   │   ├── [id]/             # ユーザー詳細
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── followers/    # フォロワー一覧
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── following/    # フォロー中一覧
│   │   │   │   │       └── page.tsx
│   │   │   │   └── search/           # ユーザー検索
│   │   │   ├── lists/                # リスト関連
│   │   │   └── ...
│   │   ├── api/                      # API Routes（プロキシ）
│   │   │   └── users/
│   │   │       └── [id]/
│   │   │           ├── follow/       # フォロー/アンフォロー
│   │   │           ├── follow-status/ # フォロー状態取得
│   │   │           ├── followers/    # フォロワー一覧
│   │   │           └── following/    # フォロー中一覧
│   │   ├── layout.tsx                # ルートレイアウト
│   │   └── page.tsx                  # トップページ
│   ├── components/                   # 共通コンポーネント
│   │   └── navigation/
│   │       └── SideNav.tsx
│   ├── hooks/                        # 共通カスタムhooks
│   │   └── useProfile.ts
│   ├── lib/                          # ユーティリティ
│   │   └── queryClient.ts            # React Query設定
│   ├── schemas/                      # Zodスキーマ定義
│   │   └── user.ts
│   ├── constants/                    # 定数
│   │   └── queryKeys.ts              # React Queryキー定義
│   ├── supabase/                     # Supabase関連
│   │   └── dal.ts                    # データアクセス層
│   └── test/                         # テストユーティリティ
├── public/                           # 静的ファイル
├── package.json                      # npm依存関係
├── tsconfig.json                     # TypeScript設定
├── eslint.config.mjs                 # ESLint設定
├── prettier.config.cjs               # Prettier設定
├── vitest.config.ts                  # Vitest設定
├── next.config.ts                    # Next.js設定
└── Dockerfile                        # Dockerイメージ定義
```

## 主要なデータモデル
- **User**: ユーザー（Supabase認証と連携）
- **Book**: 書籍
- **List**: 読書リスト
- **Category**: カテゴリ
- **Tag**: タグ
- **Card**: ナレッジカード（読書メモ）
- **Status**: ステータス（読書中、読了など）
- **Follow**: フォロー関係（自己参照多対多）

## 認証フロー
1. フロントエンド（Next.js）がSupabase Authenticationでユーザー認証
2. JWTトークンを取得
3. API Routesを経由してRails APIにリクエスト
4. Rails側でJWTトークンを検証
5. レスポンスを返す

## データフェッチパターン
1. **Server Component**: `prefetchQuery`でサーバー側でデータ取得
2. **HydrationBoundary**: dehydratedStateをクライアントに渡す
3. **Client Component**: `useQuery`でキャッシュからデータ取得
4. **Mutation**: `useMutation`でデータ更新 + キャッシュ無効化
