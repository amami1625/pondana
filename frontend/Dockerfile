# ========== ベースイメージ ==========
FROM node:22 AS base

WORKDIR /home/node/app

COPY package*.json ./

# ========== 開発環境（Playwrightを含む） ==========
FROM base AS development

# すべての依存関係をインストール
RUN npm install

# Playwrightをインストール（開発/テスト環境のみ）
RUN npx playwright install chromium
RUN npx playwright install-deps chromium

COPY . .

EXPOSE 3001
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3001"]

# ========== ビルドステージ ==========
FROM base AS builder

# 本番用の依存関係を含めてインストール
RUN npm ci

COPY . .
RUN npm run build

# ========== 本番環境（軽量） ==========
FROM node:22-slim AS production

WORKDIR /home/node/app

# 本番用の依存関係のみインストール
COPY package*.json ./
RUN npm ci --production

# ビルド成果物をコピー
COPY --from=builder /home/node/app/.next ./.next
COPY --from=builder /home/node/app/public ./public
COPY --from=builder /home/node/app/next.config.ts ./next.config.ts

EXPOSE 3001
CMD ["npm", "start"]