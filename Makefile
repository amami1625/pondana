# Makefile for React + Rails Docker development environment

.PHONY: help up down build logs ps app web db lint fix fmt rubo rubo-fix

# デフォルトターゲット - ヘルプを表示
help:
	@echo "Available commands:"
	@echo "  make up       - Start all containers in background"
	@echo "  make down     - Stop and remove all containers"
	@echo "  make build    - Build containers and start in background"
	@echo "  make logs     - Show logs from all containers"
	@echo "  make ps       - Show running containers status"
	@echo "  make app      - Access Rails container shell"
	@echo "  make web      - Access Next container shell"
	@echo "  make db       - Access PostgreSQL container shell"
	@echo "  make lint     - Run ESLint to check code quality"
	@echo "  make fix      - Run ESLint with auto-fix"
	@echo "  make fmt      - Run Prettier to format code"
	@echo "  make rubo     - Run RuboCop to check Ruby code quality"
	@echo "  make rubo-fix - Run RuboCop with auto-correct"

# コンテナを起動（バックグラウンド）
up:
	docker compose up -d

# コンテナを停止・削除
down:
	docker compose down

# コンテナをビルドして起動
build:
	docker compose up --build -d

# 全コンテナのログを表示
logs:
	docker compose logs -f

# 実行中のコンテナ一覧を表示
ps:
	docker compose ps

# Railsコンテナのシェルにアクセス
app:
	docker compose exec app bash

# Reactコンテナのシェルにアクセス
web:
	docker compose exec web bash

# PostgreSQLコンテナにアクセス
db:
	docker compose exec db psql -U postgres -d app_development

# ESLintを実行
lint:
	docker compose exec web npm run lint

# ESLintで自動修正
fix:
	docker compose exec web npm run lint:fix

# Prettierでフォーマットを統一
fmt:
	docker compose exec web npm run format

# 型チェックを実行
type:
	docker compose exec web npx tsc --noEmit

# Vitestを実行
test:
	docker compose exec web npm run test:run

# RuboCopを実行
rubo:
	docker compose exec app rubocop

# RuboCopで自動修正
rubo-fix:
	docker compose exec app rubocop --autocorrect-all