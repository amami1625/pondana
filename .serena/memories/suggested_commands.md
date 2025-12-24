# 推奨コマンド一覧

## Docker Compose コマンド（Makefile経由）

### 基本操作
```bash
make up        # コンテナをバックグラウンドで起動
make down      # コンテナを停止・削除
make build     # コンテナをビルドして起動
make logs      # 全コンテナのログを表示
make ps        # 実行中のコンテナ一覧を表示
```

### コンテナアクセス
```bash
make app       # Railsコンテナのbashにアクセス
make web       # Next.jsコンテナのbashにアクセス
make db        # PostgreSQLにアクセス
```

## フロントエンド（Next.js）コマンド

### 開発
```bash
npm run dev              # 開発サーバー起動
npm run build            # プロダクションビルド
npm run start            # プロダクションサーバー起動
```

### コード品質
```bash
make lint                # ESLint実行
make fix                 # ESLint自動修正
make fmt                 # Prettier実行
make type                # TypeScript型チェック
```

### テスト
```bash
make test                # Vitest実行（1回）
npm run test             # Vitest実行（watch mode）
npm run test:ui          # Vitest UI起動
npm run test:coverage    # カバレッジ付きテスト
```

コンテナ内で実行する場合:
```bash
docker compose exec web npm run lint
docker compose exec web npm run lint:fix
docker compose exec web npm run format
docker compose exec web npx tsc --noEmit
docker compose exec web npm run test:run
```

## バックエンド（Rails）コマンド

### 開発
```bash
bundle exec rails server -b 0.0.0.0 -p 3000  # サーバー起動
bundle exec rails db:migrate                  # マイグレーション実行
bundle exec rails db:seed                     # シードデータ投入
bundle exec rails db:prepare                  # DB準備（作成＋マイグレーション）
bundle exec rails routes                      # ルート一覧表示
bundle exec rails console                     # Railsコンソール起動
```

## Git コマンド
```bash
git status                    # 変更状態確認
git add <file>               # ステージング
git commit -m "message"      # コミット
git push origin <branch>     # プッシュ
git log --oneline            # コミット履歴（簡易版）
gh pr create                 # プルリクエスト作成（GitHub CLI）
```

## システムユーティリティコマンド（Linux）
```bash
ls -la                       # ファイル一覧表示（詳細）
cd <directory>               # ディレクトリ移動
grep -r "pattern" <path>     # 再帰的に文字列検索
find <path> -name "pattern"  # ファイル名検索
cat <file>                   # ファイル内容表示
less <file>                  # ファイル内容をページャで表示
```
