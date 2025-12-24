# タスク完了時のチェックリスト

## フロントエンド変更時

### 1. コード品質チェック
```bash
# ESLintチェック
make lint
# または
docker compose exec web npm run lint

# 型チェック
make type
# または
docker compose exec web npx tsc --noEmit

# Prettierフォーマット確認
docker compose exec web npm run format:check
```

### 2. 自動修正（必要に応じて）
```bash
# ESLint自動修正
make fix

# Prettierフォーマット適用
make fmt
```

### 3. テスト実行
```bash
# テスト実行
make test
# または
docker compose exec web npm run test:run
```

### 4. ビルド確認
```bash
# プロダクションビルドが通るか確認
docker compose exec web npm run build
```

## バックエンド変更時

### 1. マイグレーション確認
```bash
# 新しいマイグレーションがある場合
docker compose exec app bundle exec rails db:migrate

# マイグレーションのロールバック確認
docker compose exec app bundle exec rails db:rollback
docker compose exec app bundle exec rails db:migrate
```

### 2. ルート確認
```bash
# APIエンドポイントの確認
docker compose exec app bundle exec rails routes | grep <endpoint>
```

### 3. コンソールでの動作確認
```bash
# Railsコンソールで動作確認
docker compose exec app bundle exec rails console
```

## Git関連

### 1. 変更ファイル確認
```bash
git status
git diff
```

### 2. コミット前確認
- **コミットメッセージ**: feat/fix/refactorなどのプレフィックスを使用
- **コミット粒度**: 1つの論理的な変更単位
- **除外ファイル**: テストファイルなど、必要に応じて除外

### 3. コミット
```bash
git add <files>
git commit -m "$(cat <<'EOF'
feat: 機能の説明

詳細な説明（必要に応じて）

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

### 4. プッシュ前確認
```bash
# コミットログ確認
git log --oneline -n 5

# リモートとの差分確認
git diff origin/main
```

## 全体確認

### 1. 動作確認
```bash
# コンテナ起動
make up

# ログ確認
make logs

# 各サービスの動作確認
# - Rails API: http://localhost:3000
# - Next.js: http://localhost:3001
```

### 2. データベース確認
```bash
# PostgreSQL接続
make db

# テーブル確認
\dt

# データ確認
SELECT * FROM users LIMIT 5;
```

## チェックリスト要約

- [ ] ESLint/型チェック通過
- [ ] Prettierフォーマット適用
- [ ] テスト通過（該当する場合）
- [ ] ビルド成功
- [ ] マイグレーション確認（該当する場合）
- [ ] 動作確認（ブラウザ/API）
- [ ] Git差分確認
- [ ] 適切なコミットメッセージ
- [ ] 不要なファイルを除外
