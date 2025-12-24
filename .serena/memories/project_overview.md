# プロジェクト概要

## サービス名・目的
技術書など難解な書籍の読書記録に特化し、**知識を分野ごとに棚卸し・管理**するアプリケーション。

エンジニアが読んだ技術書の詳細なメモや感想を記録し、自身の学習進捗と習得範囲を可視化することで客観的に自分の学習を振り返れるようにする。他のエンジニアと読書リストを共有し、学習意欲の高いエンジニアの学習経路を築く手助けをする。

## 主要機能
- 書籍登録機能（タイトル、著者、評価、感想、ナレッジカード）
- カテゴリ・タグによる分類
- ステータス管理（読みたい、読書中、読了）
- 公開/非公開設定
- ユーザーフォロー機能
- 検索機能

## アーキテクチャ
- **モノレポ構成**: フロントエンド（frontend）とバックエンド（backend）が同一リポジトリ内に存在
- **コンテナ構成**: Docker Compose で 3つのサービス（db, app, web）を管理
- **開発環境**: Linux システム上で Docker コンテナ内で開発

## 技術スタック

### バックエンド
- Ruby on Rails 7.1.5
- Ruby 3.2.2
- PostgreSQL 15
- Puma（Webサーバー）
- JWT（認証トークン）
- rack-cors（CORS設定）

### フロントエンド
- Next.js 16（App Router）
- React 19
- TypeScript 5
- TailwindCSS 4
- TanStack Query（データフェッチ・キャッシュ管理）
- React Hook Form（フォーム管理）
- Zod 4（バリデーション）
- react-hot-toast（通知）
- Lucide React（アイコン）

### 認証・データベース
- Supabase Authentication（認証）
- PostgreSQL（Neon）

### テスト
- Vitest（フロントエンド）
- Testing Library
- RSpec（バックエンド・予定）

### デプロイ
- Vercel（フロントエンド）
- Render（バックエンド）

## ポート構成
- **PostgreSQL**: 5432
- **Rails API**: 3000
- **Next.js**: 3001
