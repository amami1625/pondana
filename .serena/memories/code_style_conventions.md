# コードスタイルと規約

## フロントエンド（TypeScript/React）

### Prettier設定
- **クオート**: シングルクオート（文字列）、ダブルクオート（JSX）
- **セミコロン**: 必須
- **末尾カンマ**: 常に付与（trailingComma: 'all'）
- **アロー関数**: 引数括弧を常に付与（arrowParens: 'always'）
- **1行の最大長**: 100文字
- **インデント**: スペース2つ
- **改行コード**: LF
- **オブジェクトのスペース**: `{ key: value }`
- **JSXの>**: 改行しない（bracketSameLine: false）

### ESLint設定
- **未使用インポート**: 自動削除（eslint-plugin-unused-imports）
- **未使用変数**: エラー（ただし `_` で始まる変数は許可）
- **console.log**: 警告（warn/error/debugは許可）
- **Next.js推奨設定**: next/core-web-vitals, next/typescript

### TypeScript設定
- **strict モード**: 有効
- **target**: ES2017
- **module**: esnext
- **moduleResolution**: bundler
- **パスエイリアス**: `@/*` は `./src/*` にマッピング
- **JSX**: react-jsx

### 命名規則
- **ファイル名**: PascalCase（コンポーネント）、camelCase（ユーティリティ）
- **コンポーネント**: PascalCase
- **hooks**: `use` プレフィックス（例: `useFollowStatus`）
- **型**: PascalCase
- **定数**: UPPER_SNAKE_CASE または camelCase

### インポート
- **絶対パス優先**: `@/` を使用（相対パス `../` は避ける）
- **順序**: 外部ライブラリ → 内部モジュール → 型

### ディレクトリ構造
```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (protected)/        # 認証が必要なページ
│   │   └── users/
│   │       ├── _hooks/     # カスタムhooks
│   │       ├── _lib/       # データフェッチ関数
│   │       ├── _components/
│   │       │   ├── actions/   # アクションコンポーネント（ボタンなど）
│   │       │   ├── clients/   # クライアントコンポーネント
│   │       │   └── display/   # 表示コンポーネント
│   │       └── [id]/       # 動的ルート
│   └── api/                # API Routes
├── components/             # 共通コンポーネント
├── hooks/                  # 共通hooks
├── lib/                    # ユーティリティ
├── schemas/                # Zodスキーマ
├── constants/              # 定数
└── supabase/               # Supabase関連
```

### コンポーネントパターン
- **Server Component優先**: データフェッチはServer Componentで
- **Prefetchパターン**: `prefetchQuery` + `HydrationBoundary` でSSRデータを渡す
- **Client Component**: `'use client'` ディレクティブを明示
- **Props型定義**: インターフェースで明示的に定義

## バックエンド（Ruby/Rails）

### Rails規約
- **命名**: スネークケース（snake_case）
- **クラス**: PascalCase
- **ファイル名**: スネークケース
- **インデント**: スペース2つ

### ディレクトリ構造
```
backend/
├── app/
│   ├── controllers/
│   ├── models/
│   ├── views/
│   ├── jobs/
│   └── mailers/
├── config/
├── db/
│   └── migrate/
└── test/
```

### API設計
- **エンドポイント**: RESTful設計
- **レスポンス**: JSON形式
- **認証**: JWT トークン（Supabase）
- **CORS**: rack-cors で設定

## Git規約

### コミットメッセージ
- **プレフィックス**:
  - `feat:` - 新機能
  - `fix:` - バグ修正
  - `refactor:` - リファクタリング
  - `test:` - テスト追加・修正
  - `docs:` - ドキュメント
  - `style:` - コードフォーマット
  - `chore:` - その他の変更

- **フッター**: 
  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  
  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
  ```

### ブランチ戦略
- **main**: 本番ブランチ
- **feature/**: 機能開発ブランチ
- **fix/**: バグ修正ブランチ

### コミット粒度
- **適切な粒度**: 1つの論理的な変更単位でコミット
- **テストファイル**: 場合によっては除外（例: `useFollowMutations.test.tsx`）
