# プロジェクト設定

## 基本設定
```yaml
プロジェクト名: RAGベースAIコーチングbot
略称: Rag-Base
開始日: 2025-11-02
MVP期間: 4週間
技術スタック:
  frontend:
    framework: Dify WebUI (Next.js 14)
    language: TypeScript
    ui: Tailwind CSS + Headless UI
    state: React Context API
  backend:
    dify: Flask + LangChain + Celery
    compass: FastAPI + SQLAlchemy
  database:
    main: Supabase PostgreSQL 16 + pgvector
    cache: Redis (Dify標準)
  ai:
    llm_prod: Claude 3.5 Haiku
    llm_dev: Claude 3.5 Sonnet
    embeddings: OpenAI text-embedding-3-small
    transcription: OpenAI Whisper API
```

## 開発環境
```yaml
ポート設定:
  # 複数プロジェクト並行開発のため、一般的でないポートを使用
  dify_web: 3287
  dify_api: 5001
  compass_frontend: 3000 (既存)
  compass_backend: 8000 (既存)
  database: 5432 (Supabase)
  redis: 6379 (Docker内部)

環境変数:
  設定ファイル: dify/docker/.env
  必須項目:
    # データベース（Supabase PostgreSQL）
    - POSTGRES_HOST
    - POSTGRES_PORT
    - POSTGRES_USER
    - POSTGRES_PASSWORD
    - POSTGRES_DB

    # ベクトルDB（Supabase pgvector）
    - VECTOR_STORE=pgvector
    - PGVECTOR_HOST
    - PGVECTOR_PORT
    - PGVECTOR_USER
    - PGVECTOR_PASSWORD
    - PGVECTOR_DATABASE

    # AI API
    - ANTHROPIC_API_KEY
    - OPENAI_API_KEY

    # Redis（Dify標準、変更不要）
    - REDIS_HOST=redis
    - REDIS_PORT=6379

    # セキュリティ
    - SECRET_KEY (ランダム生成推奨)
    - LOG_LEVEL=INFO
```

## テスト認証情報
```yaml
開発用アカウント:
  coach:
    email: coach@rag-base.local
    password: TestCoach2025!
    role: コーチ（管理者）

  test_clients:
    - email: client1@rag-base.local
      password: TestClient2025!
      role: クライアント
    - email: client2@rag-base.local
      password: TestClient2025!
      role: クライアント

外部サービス:
  Supabase:
    - 既存COM:PASSプロジェクトを使用
    - pgvector拡張を有効化済み
  Claude API:
    - 開発: Claude 3.5 Sonnet
    - 本番: Claude 3.5 Haiku
    - プロンプトキャッシング有効化
  OpenAI API:
    - Embeddings: text-embedding-3-small
    - Whisper: 動画文字起こし用

注意: 本番環境では必ず強力なパスワードに変更すること
```

## コーディング規約

### 命名規則
```yaml
ファイル名:
  - コンポーネント: PascalCase.tsx (例: ChatInterface.tsx)
  - ユーティリティ: camelCase.ts (例: formatMessage.ts)
  - 定数: UPPER_SNAKE_CASE.ts (例: API_ENDPOINTS.ts)
  - API: kebab-case.py (例: export-data.py)

変数・関数:
  - 変数: camelCase (例: userName, messageList)
  - 関数: camelCase (例: fetchUserData, generateEmbedding)
  - 定数: UPPER_SNAKE_CASE (例: MAX_CHUNK_SIZE)
  - 型/インターフェース: PascalCase (例: UserData, MessageType)

データベース:
  - テーブル: snake_case (例: knowledge_base, user_sessions)
  - カラム: snake_case (例: created_at, user_id)
```

### コード品質
```yaml
必須ルール:
  - TypeScript: strictモード有効
  - 未使用の変数/import禁止
  - console.log本番環境禁止（開発環境のみ許可）
  - エラーハンドリング必須（try-catch、エラーバウンダリ）
  - APIキーのハードコード厳禁（必ず環境変数）

フォーマット:
  - インデント: スペース2つ
  - セミコロン: あり
  - クォート: シングル（TypeScript/JavaScript）、ダブル（Python）
  - 行の最大長: 100文字（推奨）

セキュリティ:
  - パスワードは必ずハッシュ化
  - SQLインジェクション対策（ORMのパラメータ化クエリ）
  - XSS対策（入力のサニタイズ）
  - HTTPS必須（本番環境）
  - APIキーは環境変数で管理
```

### コミットメッセージ
```yaml
形式: [type]: [description]

type:
  - feat: 新機能（例: feat: データエクスポートAPI実装）
  - fix: バグ修正（例: fix: RAG検索のチャンク取得エラー修正）
  - docs: ドキュメント（例: docs: 要件定義書更新）
  - style: フォーマット（例: style: コードフォーマット適用）
  - refactor: リファクタリング（例: refactor: プロンプト生成ロジック整理）
  - test: テスト（例: test: エクスポートAPIテスト追加）
  - chore: その他（例: chore: 依存パッケージ更新）

例:
  - "feat: ユーザーRAGのベクトル化機能追加"
  - "fix: Claude APIのレート制限エラー処理改善"
  - "docs: CLAUDE.md作成完了"
```

## UI/UX要件

### デバイス対応
```yaml
クライアント向け（AIチャット）:
  デバイス: スマホ対応必須
  対象ページ:
    - D-001: ログイン
    - D-002: AIチャット
    - D-003: 会話履歴
  要件:
    - レスポンシブデザイン
    - タッチ操作最適化
    - iOS Safari、Android Chrome動作保証
    - PWA対応（オプション）
  実装: Dify標準UIで対応済み（カスタマイズ不要）

コーチ向け（管理画面）:
  デバイス: PC想定
  対象ページ:
    - D-004〜D-009: 全管理機能
  要件:
    - デスクトップブラウザ（Chrome、Edge、Firefox）
    - 大画面最適化
    - スマホ対応不要（MVP段階）
  実装: Dify標準UIで対応済み（カスタマイズ不要）
```

### モバイルテスト
```yaml
必須テストデバイス:
  iOS:
    - iPhone 12以降（iOS 15+）
    - Safari最新版
  Android:
    - Pixel 5以降（Android 11+）
    - Chrome最新版

テスト項目:
  - ログイン動作
  - チャット入力・送信
  - スクロール動作
  - 会話履歴閲覧
  - レスポンシブレイアウト
  - タッチ操作の反応速度
```

## プロジェクト固有ルール

### APIエンドポイント
```yaml
命名規則:
  - RESTful形式を厳守
  - ケバブケース使用 (/chat-messages, /user-data)
  - バージョニング: /v1/ (Dify標準)

Dify標準エンドポイント:
  - POST /v1/chat-messages: チャットメッセージ送信
  - GET /v1/conversations: 会話一覧取得
  - POST /v1/datasets/{id}/documents: ナレッジベースアップロード

COM:PASS追加エンドポイント:
  - GET /api/admin/export/{user_id}: ユーザーデータエクスポート
```

### 型定義
```yaml
配置:
  frontend: dify/web/types/index.ts (Dify標準)
  backend_dify: dify/api/types/ (Dify標準)
  backend_compass: compass/backend/src/types/index.ts

同期ルール:
  - Dify型定義は標準を優先
  - COM:PASSエクスポート型は独自定義
  - フロントエンド・バックエンド間でAPI型を共有

主要型定義:
  UserRole: "client" | "coach"
  MessageRole: "user" | "assistant"
  DatasetType: "system" | "user"
  ExportPeriod: { start_date: string; end_date: string }
```

### RAG設定
```yaml
システムRAG:
  dataset_name: "システムRAG - コーチング理論体系"
  chunk_size: 500 (トークン)
  overlap: 50 (トークン)
  top_k: 5 (検索結果数)
  embedding_model: text-embedding-3-small

ユーザーRAG:
  dataset_name: "ユーザーRAG_{user_id}"
  chunk_size: 500 (トークン)
  overlap: 50 (トークン)
  top_k: 3 (検索結果数)
  embedding_model: text-embedding-3-small

ハイブリッド検索:
  - システムRAG Top 5 + ユーザーRAG Top 3
  - リランク: オプション（精度向上時に導入）
  - 応答時間目標: 3-5秒
```

## 🆕 最新技術情報（知識カットオフ対応）

### Dify最新情報
```yaml
バージョン: 0.6.x系（2025年1月時点）
重要な変更:
  - pgvectorネイティブサポート（Pinecone等の外部不要）
  - プロンプトキャッシング対応（Claude API）
  - ワークフロービジュアルエディタ改善

破壊的変更:
  - なし（MVP段階では標準設定を使用）
```

### Claude API
```yaml
プロンプトキャッシング:
  - 有効化必須（コスト削減効果: 最大90%）
  - キャッシュTTL: 5分
  - 適用対象: システムRAG検索結果、システムプロンプト

料金（2025年1月時点）:
  Haiku: 入力$0.80/1M、出力$4.00/1M
  Sonnet: 入力$3.00/1M、出力$15.00/1M
  キャッシュヒット: 入力の10%料金
```

### OpenAI API
```yaml
Embeddings最新情報:
  - text-embedding-3-small: $0.02/1M（変更なし）
  - 次元数: 1,536（変更なし）

Whisper:
  - 料金: $0.006/分（変更なし）
  - 対応形式: mp3, mp4, wav, m4a等
```

## ⚠️ プロジェクト固有の注意事項

### MVP段階の制約
```yaml
認証:
  - Dify標準認証とCOM:PASS認証は別々
  - SSO統合は本番化時に実装
  - クライアントは2つのシステムに別々にログイン

データ更新:
  - 週次手動更新（コーチが手動でエクスポート・アップロード）
  - 自動化は本番化時に実装

スケール制限:
  - DigitalOcean Droplet 4GB: 5-15同時ユーザー想定
  - 超過時はスペックアップ必要
```

### セキュリティ注意事項
```yaml
機密情報の取り扱い:
  - クライアントのメンタルヘルスデータは医療データに準じる
  - 会話履歴は必ずユーザー分離（Dify標準実装）
  - バックアップは定期実行（週1回最低）

本番環境必須対応:
  - HTTPS必須
  - 定期バックアップ
  - アクセスログ監視
  - エラー通知設定
```

### コスト管理
```yaml
想定月額（テストユーザー10名）:
  - インフラ: $24（DigitalOcean Droplet 4GB）
  - Claude API: $13.50（1,000メッセージ/月）
  - OpenAI API: $1-2（追加データのEmbeddings）
  - 合計: $38.50-$39.50/月

コスト削減策:
  - プロンプトキャッシング有効化（最重要）
  - 開発環境はローカル（Docker Compose）
  - 不要な会話履歴の定期削除（6ヶ月以上経過）
```

## 📝 作業ログ（最新10件）

```yaml
- 2025-11-02: MVP要件定義書作成完了 (docs/requirements.md)
- 2025-11-02: SCOPE_PROGRESS.md更新（統合ページ管理表追加）
- 2025-11-02: CLAUDE.md作成完了
- 2025-11-02: UI/UX要件追加（クライアント: スマホ必須、コーチ: PC想定）
- 2025-11-02: 要件定義フェーズ完了（Step#1〜Step#10）
- [次回以降の作業を記録]
```

## 🔧 開発環境セットアップ手順

### 1. Difyローカル環境構築
```bash
# Difyクローン
git clone https://github.com/langgenius/dify.git
cd dify/docker

# 環境変数設定
cp .env.example .env
# .envファイルを編集（上記「環境変数」セクション参照）

# Docker起動
docker compose up -d

# アクセス確認
# Web UI: http://localhost:3287
# API: http://localhost:5001
```

### 2. COM:PASSデータエクスポートAPI追加
```bash
# COM:PASSバックエンドディレクトリへ移動
cd /path/to/compass/backend

# 新規ファイル作成
# src/api/admin/export.py

# 実装内容は requirements.md の C-001 参照
```

### 3. 外部サービス設定
```bash
# 1. Supabase pgvector有効化
# SupabaseダッシュボードのSQL Editorで実行:
CREATE EXTENSION IF NOT EXISTS vector;

# 2. Claude API
# https://console.anthropic.com でAPIキー取得
# .envファイルに設定

# 3. OpenAI API
# https://platform.openai.com でAPIキー取得
# .envファイルに設定
```

## 🚀 クイックスタート（開発者向け）

```bash
# 1. リポジトリクローン
git clone [リポジトリURL]
cd Rag-Base

# 2. Difyセットアップ
cd dify/docker
cp .env.example .env
# .envファイル編集
docker compose up -d

# 3. COM:PASS起動（既存環境）
cd ../compass
# 既存の起動手順に従う

# 4. 初回設定
# ブラウザで http://localhost:3287 にアクセス
# 管理者アカウント作成（coach@rag-base.local）
```

## 📚 参考リンク

- [Dify公式ドキュメント](https://docs.dify.ai/)
- [Claude API リファレンス](https://docs.anthropic.com/)
- [OpenAI API リファレンス](https://platform.openai.com/docs/)
- [Supabase pgvector ガイド](https://supabase.com/docs/guides/database/extensions/pgvector)
- [要件定義書](./docs/requirements.md)
- [開発進捗](./docs/SCOPE_PROGRESS.md)

---

**最終更新**: 2025-11-02
**作成者**: BlueLamp レコンX + Claude Code
**バージョン**: MVP v1.0
