# KnowledgeBasePage（D-005）API仕様書

作成日: 2025-11-02
対象ページ: /admin/knowledge
バージョン: MVP v1.0

## 概要

本ドキュメントは、KnowledgeBasePage（ナレッジベース管理）で使用されるAPIエンドポイントの仕様を定義します。現在はモックサービス（`mockDatasetService.ts`）で実装予定であり、本番環境ではDify API（v1）に置き換えられます。

## エンドポイント一覧

| No | メソッド | エンドポイント | 用途 | モック関数 | 優先度 |
|----|---------|--------------|------|-----------|--------|
| 1 | GET | `/v1/datasets` | ナレッジベース一覧取得 | `mockGetDatasets` | 高 |
| 2 | GET | `/v1/datasets/{dataset_id}/documents` | ドキュメント一覧取得 | `mockGetDocuments` | 高 |
| 3 | POST | `/v1/datasets/{dataset_id}/documents` | ドキュメントアップロード | `mockUploadDocument` | 高 |
| 4 | DELETE | `/v1/datasets/{dataset_id}/documents/{document_id}` | ドキュメント削除 | `mockDeleteDocument` | 高 |
| 5 | PUT | `/v1/datasets/{dataset_id}/settings` | チャンク設定更新 | `mockUpdateChunkSettings` | 高 |
| 6 | POST | `/v1/datasets/{dataset_id}/search-test` | 検索精度テスト | `mockSearchTest` | 中 |

---

## API詳細仕様

---

### 1. ナレッジベース一覧取得 API

#### 基本情報
- **エンドポイント**: `GET /v1/datasets`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: システムRAGとユーザーRAGの一覧を取得

#### Request

##### Headers
```http
Authorization: Bearer {token}
```

##### Query Parameters
なし

##### Request Example
```http
GET /v1/datasets
```

#### Response

##### Success Response (200 OK)
```json
[
  {
    "dataset_id": "system-rag-001",
    "name": "システムRAG - コーチング理論体系",
    "type": "system",
    "embedding_model": "text-embedding-3-small",
    "chunk_size": 500,
    "overlap": 50,
    "created_at": "2025-11-01T00:00:00Z",
    "updated_at": "2025-11-02T10:00:00Z",
    "total_documents": 15,
    "total_chunks": 342
  },
  {
    "dataset_id": "user-rag-client1",
    "name": "ユーザーRAG_client1",
    "type": "user",
    "embedding_model": "text-embedding-3-small",
    "chunk_size": 500,
    "overlap": 50,
    "created_at": "2025-11-01T12:00:00Z",
    "updated_at": "2025-11-02T09:30:00Z",
    "total_documents": 8,
    "total_chunks": 156
  }
]
```

##### Response Fields
| フィールド | 型 | 説明 | 例 |
|----------|---|------|-----|
| `dataset_id` | string (UUID) | ナレッジベースID | `"system-rag-001"` |
| `name` | string | ナレッジベース名 | `"システムRAG - コーチング理論体系"` |
| `type` | string | タイプ（system/user） | `"system"` |
| `embedding_model` | string | Embeddingモデル | `"text-embedding-3-small"` |
| `chunk_size` | number | チャンクサイズ（トークン） | `500` |
| `overlap` | number | オーバーラップ（トークン） | `50` |
| `created_at` | string (ISO 8601) | 作成日時 | `"2025-11-01T00:00:00Z"` |
| `updated_at` | string (ISO 8601) | 更新日時 | `"2025-11-02T10:00:00Z"` |
| `total_documents` | number | 総ドキュメント数 | `15` |
| `total_chunks` | number | 総チャンク数 | `342` |

##### Error Response (401 Unauthorized)
```json
{
  "error": "unauthorized",
  "message": "認証が必要です",
  "status": 401
}
```

##### Error Response (403 Forbidden)
```json
{
  "error": "forbidden",
  "message": "コーチロールのみアクセス可能です",
  "status": 403
}
```

#### モック実装の挙動

##### 初期データ
```typescript
const MOCK_DATASETS: KnowledgeBase[] = [
  {
    dataset_id: 'system-rag-001',
    name: 'システムRAG - コーチング理論体系',
    type: 'system',
    embedding_model: 'text-embedding-3-small',
    chunk_size: 500,
    overlap: 50,
    created_at: '2025-11-01T00:00:00Z',
    updated_at: '2025-11-02T10:00:00Z',
    total_documents: 15,
    total_chunks: 342,
  },
  {
    dataset_id: 'user-rag-client1',
    name: 'ユーザーRAG_client1',
    type: 'user',
    embedding_model: 'text-embedding-3-small',
    chunk_size: 500,
    overlap: 50,
    created_at: '2025-11-01T12:00:00Z',
    updated_at: '2025-11-02T09:30:00Z',
    total_documents: 8,
    total_chunks: 156,
  },
];
```

##### 応答遅延
```typescript
await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms遅延
```

---

### 2. ドキュメント一覧取得 API

#### 基本情報
- **エンドポイント**: `GET /v1/datasets/{dataset_id}/documents`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: 指定されたナレッジベースのドキュメント一覧を取得

#### Request

##### Headers
```http
Authorization: Bearer {token}
```

##### Path Parameters
| パラメータ | 型 | 説明 | 例 |
|----------|---|------|-----|
| `dataset_id` | string (UUID) | ナレッジベースID | `"system-rag-001"` |

##### Request Example
```http
GET /v1/datasets/system-rag-001/documents
```

#### Response

##### Success Response (200 OK)
```json
[
  {
    "document_id": "doc-001",
    "dataset_id": "system-rag-001",
    "filename": "コーチング基礎理論.pdf",
    "file_type": "pdf",
    "uploaded_at": "2025-11-01T10:00:00Z",
    "vectorized_at": "2025-11-01T10:05:00Z",
    "chunk_count": 45,
    "status": "completed"
  },
  {
    "document_id": "doc-002",
    "dataset_id": "system-rag-001",
    "filename": "傾聴スキル実践ガイド.docx",
    "file_type": "docx",
    "uploaded_at": "2025-11-01T14:00:00Z",
    "vectorized_at": null,
    "chunk_count": 0,
    "status": "processing"
  },
  {
    "document_id": "doc-003",
    "dataset_id": "system-rag-001",
    "filename": "質問技法まとめ.txt",
    "file_type": "txt",
    "uploaded_at": "2025-11-02T09:00:00Z",
    "vectorized_at": "2025-11-02T09:02:00Z",
    "chunk_count": 23,
    "status": "completed"
  }
]
```

##### Response Fields
| フィールド | 型 | 説明 | 例 |
|----------|---|------|-----|
| `document_id` | string (UUID) | ドキュメントID | `"doc-001"` |
| `dataset_id` | string (UUID) | 所属ナレッジベースID | `"system-rag-001"` |
| `filename` | string | ファイル名 | `"コーチング基礎理論.pdf"` |
| `file_type` | string | ファイル種別 | `"pdf"` / `"docx"` / `"txt"` |
| `uploaded_at` | string (ISO 8601) | アップロード日時 | `"2025-11-01T10:00:00Z"` |
| `vectorized_at` | string / null | ベクトル化完了日時 | `"2025-11-01T10:05:00Z"` |
| `chunk_count` | number | チャンク数 | `45` |
| `status` | string | ステータス | `"pending"` / `"processing"` / `"completed"` / `"failed"` |

##### Status説明
- **pending**: アップロード完了、ベクトル化待機中
- **processing**: ベクトル化処理中
- **completed**: ベクトル化完了（緑色バッジ）
- **failed**: ベクトル化エラー（赤色バッジ）

##### Error Response (404 Not Found)
```json
{
  "error": "not_found",
  "message": "指定されたナレッジベースが見つかりません",
  "status": 404
}
```

---

### 3. ドキュメントアップロード API

#### 基本情報
- **エンドポイント**: `POST /v1/datasets/{dataset_id}/documents`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: ナレッジベースにドキュメントをアップロード

#### Request

##### Headers
```http
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

##### Path Parameters
| パラメータ | 型 | 説明 | 例 |
|----------|---|------|-----|
| `dataset_id` | string (UUID) | ナレッジベースID | `"system-rag-001"` |

##### Form Data
| フィールド | 型 | 必須 | 説明 | 制限 |
|----------|---|------|------|------|
| `file` | File | ○ | アップロードファイル | PDF/DOCX/TXT、最大10MB |

##### 対応ファイル形式
- **PDF**: `.pdf`
- **DOCX**: `.docx`
- **TXT**: `.txt`

##### 最大ファイルサイズ
- **10MB**（10,485,760 bytes）

##### Request Example
```http
POST /v1/datasets/system-rag-001/documents
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="新規ドキュメント.pdf"
Content-Type: application/pdf

<binary data>
------WebKitFormBoundary--
```

#### Response

##### Success Response (201 Created)
```json
{
  "document_id": "doc-004",
  "dataset_id": "system-rag-001",
  "filename": "新規ドキュメント.pdf",
  "file_type": "pdf",
  "uploaded_at": "2025-11-02T11:00:00Z",
  "vectorized_at": null,
  "chunk_count": 0,
  "status": "pending"
}
```

##### Error Response (400 Bad Request - 不正なファイル形式)
```json
{
  "error": "invalid_file_type",
  "message": "対応していないファイル形式です。PDF、DOCX、TXTのみアップロード可能です。",
  "status": 400
}
```

##### Error Response (400 Bad Request - ファイルサイズ超過)
```json
{
  "error": "file_too_large",
  "message": "ファイルサイズが10MBを超えています。",
  "status": 400
}
```

#### ベクトル化処理フロー

##### 1. ファイルアップロード
- クライアントからmultipart/form-dataで送信
- サーバーがファイルを受信・保存

##### 2. チャンク分割
- ドキュメントをチャンクサイズ（デフォルト500トークン）で分割
- オーバーラップ（デフォルト50トークン）を考慮

##### 3. Embedding生成
- OpenAI `text-embedding-3-small`で各チャンクをベクトル化
- 次元数: 1,536

##### 4. pgvector保存
- Supabase PostgreSQL + pgvectorにベクトルを保存
- チャンクメタデータ（document_id, position, content）も保存

##### 5. ステータス更新
- `status: "pending"` → `"processing"` → `"completed"`
- エラー時は `"failed"`

---

### 4. ドキュメント削除 API

#### 基本情報
- **エンドポイント**: `DELETE /v1/datasets/{dataset_id}/documents/{document_id}`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: ドキュメントとそのベクトルデータを削除

#### Request

##### Headers
```http
Authorization: Bearer {token}
```

##### Path Parameters
| パラメータ | 型 | 説明 | 例 |
|----------|---|------|-----|
| `dataset_id` | string (UUID) | ナレッジベースID | `"system-rag-001"` |
| `document_id` | string (UUID) | ドキュメントID | `"doc-001"` |

##### Request Example
```http
DELETE /v1/datasets/system-rag-001/documents/doc-001
```

#### Response

##### Success Response (204 No Content)
レスポンスボディなし

##### Error Response (404 Not Found)
```json
{
  "error": "not_found",
  "message": "指定されたドキュメントが見つかりません",
  "status": 404
}
```

##### Error Response (409 Conflict - 処理中ドキュメントの削除)
```json
{
  "error": "document_processing",
  "message": "ベクトル化処理中のドキュメントは削除できません",
  "status": 409
}
```

#### 削除対象
- ドキュメントレコード（documents テーブル）
- 関連チャンクレコード（chunks テーブル）
- ベクトルデータ（pgvector）
- 元ファイル（ストレージ）

---

### 5. チャンク設定更新 API

#### 基本情報
- **エンドポイント**: `PUT /v1/datasets/{dataset_id}/settings`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: チャンクサイズとオーバーラップの設定を更新

#### Request

##### Headers
```http
Authorization: Bearer {token}
Content-Type: application/json
```

##### Path Parameters
| パラメータ | 型 | 説明 | 例 |
|----------|---|------|-----|
| `dataset_id` | string (UUID) | ナレッジベースID | `"system-rag-001"` |

##### Request Body
```json
{
  "chunk_size": 800,
  "overlap": 100
}
```

##### Request Fields
| フィールド | 型 | 必須 | 説明 | 制限 |
|----------|---|------|------|------|
| `chunk_size` | number | ○ | チャンクサイズ（トークン） | 100-1000 |
| `overlap` | number | ○ | オーバーラップ（トークン） | 0-200 |

##### Request Example
```http
PUT /v1/datasets/system-rag-001/settings
Content-Type: application/json

{
  "chunk_size": 800,
  "overlap": 100
}
```

#### Response

##### Success Response (200 OK)
```json
{
  "dataset_id": "system-rag-001",
  "name": "システムRAG - コーチング理論体系",
  "type": "system",
  "embedding_model": "text-embedding-3-small",
  "chunk_size": 800,
  "overlap": 100,
  "created_at": "2025-11-01T00:00:00Z",
  "updated_at": "2025-11-02T11:15:00Z",
  "total_documents": 15,
  "total_chunks": 342
}
```

##### Error Response (400 Bad Request - 不正な値)
```json
{
  "error": "invalid_chunk_settings",
  "message": "チャンクサイズは100-1000、オーバーラップは0-200の範囲で指定してください",
  "status": 400
}
```

#### 注意事項
- **既存ドキュメントへの影響**: 設定更新後にアップロードされたドキュメントのみ新設定が適用されます
- **再ベクトル化**: 既存ドキュメントを新設定で再ベクトル化する場合は、ドキュメント削除→再アップロードが必要

---

### 6. 検索精度テスト API

#### 基本情報
- **エンドポイント**: `POST /v1/datasets/{dataset_id}/search-test`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: ナレッジベースの検索精度を確認

#### Request

##### Headers
```http
Authorization: Bearer {token}
Content-Type: application/json
```

##### Path Parameters
| パラメータ | 型 | 説明 | 例 |
|----------|---|------|-----|
| `dataset_id` | string (UUID) | ナレッジベースID | `"system-rag-001"` |

##### Request Body
```json
{
  "query": "コーチングの傾聴スキルとは",
  "top_k": 5
}
```

##### Request Fields
| フィールド | 型 | 必須 | 説明 | 制限 |
|----------|---|------|------|------|
| `query` | string | ○ | 検索クエリ | 1-500文字 |
| `top_k` | number | ○ | 取得件数 | 1-20 |

##### Request Example
```http
POST /v1/datasets/system-rag-001/search-test
Content-Type: application/json

{
  "query": "コーチングの傾聴スキルとは",
  "top_k": 5
}
```

#### Response

##### Success Response (200 OK)
```json
[
  {
    "chunk_id": "chunk-045",
    "document_id": "doc-001",
    "filename": "コーチング基礎理論.pdf",
    "content": "傾聴スキルは、クライアントの話を深く理解し、共感的に受け止めるコーチングの基本技術です。単に聞くだけでなく、言葉の背後にある感情や価値観を読み取る力が求められます。",
    "similarity_score": 0.87,
    "position": 12
  },
  {
    "chunk_id": "chunk-078",
    "document_id": "doc-002",
    "filename": "傾聴スキル実践ガイド.docx",
    "content": "効果的な傾聴には、視線、うなずき、相づちといった非言語的なコミュニケーションも重要です。これらの技術を組み合わせることで、クライアントは安心して話すことができます。",
    "similarity_score": 0.82,
    "position": 5
  },
  {
    "chunk_id": "chunk-123",
    "document_id": "doc-003",
    "filename": "質問技法まとめ.txt",
    "content": "傾聴と質問技法は表裏一体です。傾聴によってクライアントの内面を理解し、それを基に適切な質問を投げかけることで、深い気づきを促すことができます。",
    "similarity_score": 0.78,
    "position": 8
  },
  {
    "chunk_id": "chunk-201",
    "document_id": "doc-005",
    "filename": "コーチング事例集.pdf",
    "content": "ケーススタディ: ある企業のマネージャーに対するコーチングでは、傾聴スキルを活用して部下との関係性を改善しました。",
    "similarity_score": 0.65,
    "position": 15
  },
  {
    "chunk_id": "chunk-255",
    "document_id": "doc-007",
    "filename": "コミュニケーション理論.docx",
    "content": "心理学的アプローチでは、傾聴は相手への敬意と信頼を示す行為とされています。",
    "similarity_score": 0.58,
    "position": 3
  }
]
```

##### Response Fields
| フィールド | 型 | 説明 | 例 |
|----------|---|------|-----|
| `chunk_id` | string (UUID) | チャンクID | `"chunk-045"` |
| `document_id` | string (UUID) | ドキュメントID | `"doc-001"` |
| `filename` | string | ファイル名 | `"コーチング基礎理論.pdf"` |
| `content` | string | チャンク内容 | `"傾聴スキルは..."` |
| `similarity_score` | number | 類似度スコア（0-1） | `0.87` |
| `position` | number | チャンク位置 | `12` |

##### 類似度スコア（Similarity Score）
- **0.8-1.0**: 高い関連性（濃い緑色で表示）
- **0.6-0.8**: 中程度の関連性（黄色で表示）
- **0.0-0.6**: 低い関連性（灰色で表示）

##### Error Response (400 Bad Request - クエリが空)
```json
{
  "error": "invalid_query",
  "message": "検索クエリを入力してください",
  "status": 400
}
```

---

## データ型定義

### TypeScript型定義（frontend/src/types/index.ts）

```typescript
// ナレッジベース
export interface KnowledgeBase {
  dataset_id: string; // UUID
  name: string; // "システムRAG" / "ユーザーRAG_{user_id}"
  type: DatasetType;
  embedding_model: string; // "text-embedding-3-small"
  chunk_size: number; // デフォルト: 500
  overlap: number; // デフォルト: 50
  created_at: string; // ISO 8601
  updated_at?: string; // ISO 8601
  total_documents: number;
  total_chunks: number;
}

// ドキュメント
export interface Document {
  document_id: string; // UUID
  dataset_id: string;
  filename: string;
  file_type: string; // "pdf" | "docx" | "txt"
  uploaded_at: string; // ISO 8601
  vectorized_at?: string; // ISO 8601
  chunk_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// チャンク
export interface Chunk {
  chunk_id: string; // UUID
  document_id: string;
  content: string;
  position: number; // チャンク順序
  created_at: string; // ISO 8601
}

// ドキュメントアップロードリクエスト
export interface DocumentUploadRequest {
  dataset_id: string;
  file: File;
}

// チャンク設定更新リクエスト
export interface ChunkSettingsUpdateRequest {
  dataset_id: string;
  chunk_size: number;
  overlap: number;
}

// 検索精度テストリクエスト
export interface SearchTestRequest {
  dataset_id: string;
  query: string;
  top_k: number;
}

// 検索精度テスト結果
export interface SearchTestResult {
  chunk_id: string;
  document_id: string;
  filename: string;
  content: string;
  similarity_score: number; // 0-1
  position: number;
}

// データセット型
export type DatasetType = 'system' | 'user';

// APIエンドポイント定義
export const API_PATHS = {
  // ...
  DATASETS: {
    LIST: '/v1/datasets',
    DETAIL: (datasetId: string) => `/v1/datasets/${datasetId}`,
    DOCUMENTS: (datasetId: string) => `/v1/datasets/${datasetId}/documents`,
    DOCUMENT_DETAIL: (datasetId: string, documentId: string) =>
      `/v1/datasets/${datasetId}/documents/${documentId}`,
    SETTINGS: (datasetId: string) => `/v1/datasets/${datasetId}/settings`,
    SEARCH_TEST: (datasetId: string) => `/v1/datasets/${datasetId}/search-test`,
  },
  // ...
} as const;
```

---

## エラーコード一覧

| HTTPステータス | エラーコード | メッセージ | 原因 |
|--------------|------------|-----------|------|
| 400 | `invalid_file_type` | 対応していないファイル形式です | PDF/DOCX/TXT以外のファイルアップロード |
| 400 | `file_too_large` | ファイルサイズが10MBを超えています | 10MB超のファイルアップロード |
| 400 | `invalid_chunk_settings` | チャンクサイズは100-1000、オーバーラップは0-200の範囲で指定してください | チャンク設定の範囲外の値 |
| 400 | `invalid_query` | 検索クエリを入力してください | 検索クエリが空 |
| 401 | `unauthorized` | 認証が必要です | 認証トークンなし |
| 403 | `forbidden` | コーチロールのみアクセス可能です | クライアントロールのアクセス |
| 404 | `not_found` | 指定されたナレッジベースが見つかりません | 存在しないdataset_id |
| 404 | `not_found` | 指定されたドキュメントが見つかりません | 存在しないdocument_id |
| 409 | `document_processing` | ベクトル化処理中のドキュメントは削除できません | status="processing"のドキュメント削除 |
| 500 | `internal_server_error` | サーバーエラーが発生しました | サーバー内部エラー |

---

## ファイルアップロード仕様

### 対応形式
- **PDF**: `.pdf`（Adobe PDF形式）
- **DOCX**: `.docx`（Microsoft Word 2007以降）
- **TXT**: `.txt`（UTF-8エンコード推奨）

### 最大サイズ
- **10MB**（10,485,760 bytes）

### ファイル名制限
- **最大文字数**: 255文字
- **使用可能文字**: 英数字、日本語、`-`, `_`, `.`, スペース
- **禁止文字**: `/`, `\`, `:`, `*`, `?`, `"`, `<`, `>`, `|`

### アップロード時の処理
1. ファイル形式チェック（拡張子とMIMEタイプ）
2. ファイルサイズチェック（10MB以下）
3. ファイル名サニタイズ（危険な文字を除去）
4. ファイル保存（Supabase Storage または ローカルストレージ）
5. ドキュメントレコード作成（status: "pending"）
6. ベクトル化キュー登録（非同期処理）

### サポートされないファイル
- **画像**: PNG, JPG, GIF等
- **Excel**: XLS, XLSX
- **PowerPoint**: PPT, PPTX
- **圧縮ファイル**: ZIP, RAR等
- **実行ファイル**: EXE, SH等

---

## ベクトル化処理フロー

### 1. ファイルアップロード
```
クライアント → サーバー
POST /v1/datasets/{dataset_id}/documents
Content-Type: multipart/form-data
```

### 2. ドキュメント保存
```
サーバー → ストレージ
ファイル保存: /uploads/{dataset_id}/{document_id}/{filename}
```

### 3. チャンク分割
```
サーバー → チャンク処理エンジン
- チャンクサイズ: 500トークン（デフォルト）
- オーバーラップ: 50トークン（デフォルト）
- 分割アルゴリズム: LangChain TextSplitter
```

### 4. Embedding生成
```
サーバー → OpenAI API
POST https://api.openai.com/v1/embeddings
Request:
{
  "model": "text-embedding-3-small",
  "input": ["チャンク1", "チャンク2", ...]
}
Response:
{
  "data": [
    { "embedding": [0.123, 0.456, ...] },
    { "embedding": [0.789, 0.012, ...] },
    ...
  ]
}
```

### 5. pgvector保存
```
サーバー → Supabase PostgreSQL (pgvector)
INSERT INTO chunks (chunk_id, document_id, content, embedding, position)
VALUES (
  'chunk-001',
  'doc-001',
  'チャンク1の内容',
  '[0.123, 0.456, ...]',
  1
);
```

### 6. ステータス更新
```
サーバー → データベース
UPDATE documents
SET status = 'completed', vectorized_at = NOW(), chunk_count = 45
WHERE document_id = 'doc-001';
```

### 処理時間の目安
- **小規模ファイル（1-10ページ）**: 30秒-1分
- **中規模ファイル（10-50ページ）**: 1-3分
- **大規模ファイル（50-100ページ）**: 3-5分

---

## セキュリティ

### アクセス制御
- **認証**: Bearerトークン必須
- **認可**: コーチロール（`role: "coach"`）のみアクセス可能
- **クライアントロール**: 403 Forbiddenエラーを返す
- **未認証ユーザー**: 401 Unauthorizedエラーを返す

### ファイルアップロードセキュリティ
- **ファイル形式検証**: 拡張子とMIMEタイプの両方をチェック
- **ファイルサイズ制限**: 10MB以下に制限
- **ファイル名サニタイズ**: 危険な文字を除去
- **ウイルススキャン**: 本番環境では導入推奨（MVP段階では未実装）

### データ保護
- **ナレッジベース分離**: ユーザーRAGはuser_idで分離
- **ベクトルデータ暗号化**: pgvectorはPostgreSQLの暗号化機能を使用
- **ファイル保存**: Supabase Storageの暗号化機能を使用

### 実装例（バックエンド側）
```python
@app.route('/v1/datasets/<dataset_id>/documents', methods=['POST'])
@require_auth
@require_role('coach')
def upload_document(dataset_id):
    """
    ドキュメントアップロードエンドポイント
    コーチロールのみアクセス可能
    """
    # ファイル取得
    file = request.files.get('file')
    if not file:
        return jsonify({
            "error": "no_file",
            "message": "ファイルが指定されていません",
            "status": 400
        }), 400

    # ファイル形式チェック
    allowed_extensions = ['pdf', 'docx', 'txt']
    file_ext = file.filename.rsplit('.', 1)[1].lower()
    if file_ext not in allowed_extensions:
        return jsonify({
            "error": "invalid_file_type",
            "message": "対応していないファイル形式です。PDF、DOCX、TXTのみアップロード可能です。",
            "status": 400
        }), 400

    # ファイルサイズチェック
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    if file_size > 10 * 1024 * 1024:  # 10MB
        return jsonify({
            "error": "file_too_large",
            "message": "ファイルサイズが10MBを超えています。",
            "status": 400
        }), 400

    # ファイル保存・ベクトル化処理
    document = save_and_vectorize_document(dataset_id, file)

    return jsonify(document), 201
```

---

## パフォーマンス

### 応答時間目標
- **ナレッジベース一覧取得**: 300ms以内
- **ドキュメント一覧取得**: 500ms以内
- **ドキュメントアップロード**: 1秒以内（ファイル保存のみ）
- **ベクトル化処理**: 1-5分（ファイルサイズにより変動）
- **ドキュメント削除**: 500ms以内
- **チャンク設定更新**: 300ms以内
- **検索精度テスト**: 1秒以内

### キャッシング戦略
- **ナレッジベース一覧**: キャッシュTTL 5分
- **ドキュメント一覧**: キャッシュTTL 1分
- **検索結果**: キャッシュなし（都度実行）

### 最適化手法
- **データベースインデックス**: `datasets.dataset_id`, `documents.dataset_id`, `chunks.document_id`
- **ページネーション**: ドキュメント一覧は50件ずつ取得（MVP段階では未実装）
- **非同期ベクトル化**: アップロード後は非同期処理でベクトル化

---

## モックから本番APIへの移行

### @MOCK_TO_API マーカー

モックサービス内に以下のマーカーを記載します。

#### mockGetDatasets
```typescript
// @MOCK_TO_API: GET {API_PATHS.DATASETS.LIST}
// Response: KnowledgeBase[]
```

#### mockGetDocuments
```typescript
// @MOCK_TO_API: GET {API_PATHS.DATASETS.DOCUMENTS(dataset_id)}
// Response: Document[]
```

#### mockUploadDocument
```typescript
// @MOCK_TO_API: POST {API_PATHS.DATASETS.DOCUMENTS(dataset_id)}
// Request: FormData { file: File }
// Response: Document
```

#### mockDeleteDocument
```typescript
// @MOCK_TO_API: DELETE {API_PATHS.DATASETS.DOCUMENT_DETAIL(dataset_id, document_id)}
// Response: void
```

#### mockUpdateChunkSettings
```typescript
// @MOCK_TO_API: PUT {API_PATHS.DATASETS.SETTINGS(dataset_id)}
// Request: ChunkSettingsUpdateRequest
// Response: KnowledgeBase
```

#### mockSearchTest
```typescript
// @MOCK_TO_API: POST {API_PATHS.DATASETS.SEARCH_TEST(dataset_id)}
// Request: SearchTestRequest
// Response: SearchTestResult[]
```

### 移行手順

#### 1. 本番サービス実装
```typescript
// frontend/src/services/api/datasetService.ts
import axios from 'axios';
import { API_PATHS } from '@/types';
import type {
  KnowledgeBase,
  Document,
  DocumentUploadRequest,
  ChunkSettingsUpdateRequest,
  SearchTestRequest,
  SearchTestResult,
} from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター（認証トークン付与）
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * ナレッジベース一覧取得
 */
export const getDatasets = async (): Promise<KnowledgeBase[]> => {
  const response = await api.get(API_PATHS.DATASETS.LIST);
  return response.data;
};

/**
 * ドキュメント一覧取得
 */
export const getDocuments = async (datasetId: string): Promise<Document[]> => {
  const response = await api.get(API_PATHS.DATASETS.DOCUMENTS(datasetId));
  return response.data;
};

/**
 * ドキュメントアップロード
 */
export const uploadDocument = async (
  datasetId: string,
  file: File
): Promise<Document> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(
    API_PATHS.DATASETS.DOCUMENTS(datasetId),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * ドキュメント削除
 */
export const deleteDocument = async (
  datasetId: string,
  documentId: string
): Promise<void> => {
  await api.delete(API_PATHS.DATASETS.DOCUMENT_DETAIL(datasetId, documentId));
};

/**
 * チャンク設定更新
 */
export const updateChunkSettings = async (
  datasetId: string,
  settings: ChunkSettingsUpdateRequest
): Promise<KnowledgeBase> => {
  const response = await api.put(
    API_PATHS.DATASETS.SETTINGS(datasetId),
    settings
  );
  return response.data;
};

/**
 * 検索精度テスト
 */
export const searchTest = async (
  datasetId: string,
  request: SearchTestRequest
): Promise<SearchTestResult[]> => {
  const response = await api.post(
    API_PATHS.DATASETS.SEARCH_TEST(datasetId),
    request
  );
  return response.data;
};
```

#### 2. KnowledgeBasePage内のimport変更
```typescript
// Before (モック)
import { mockGetDatasets } from '@/services/api/mockDatasetService';

// After (本番)
import { getDatasets } from '@/services/api/datasetService';
```

---

## レート制限

### 制限値（MVP段階）
- **ナレッジベース一覧**: 60リクエスト/分/ユーザー
- **ドキュメント一覧**: 60リクエスト/分/ユーザー
- **ドキュメントアップロード**: 10リクエスト/分/ユーザー
- **ドキュメント削除**: 30リクエスト/分/ユーザー
- **チャンク設定更新**: 30リクエスト/分/ユーザー
- **検索精度テスト**: 30リクエスト/分/ユーザー

### レート制限超過時のレスポンス
```json
{
  "error": "rate_limit_exceeded",
  "message": "リクエスト数が制限を超えました。1分後に再試行してください。",
  "status": 429,
  "retry_after": 60
}
```

---

## 本番環境での拡張機能（MVP後）

### 1. ページネーション
```http
GET /v1/datasets/{dataset_id}/documents?page=1&limit=50
```

### 2. ドキュメント検索
```http
GET /v1/datasets/{dataset_id}/documents?search=コーチング
```

### 3. ドキュメントソート
```http
GET /v1/datasets/{dataset_id}/documents?sort_by=uploaded_at&order=desc
```

### 4. バッチアップロード
```http
POST /v1/datasets/{dataset_id}/documents/batch
Content-Type: multipart/form-data
files[]: file1.pdf, file2.docx, file3.txt
```

### 5. 再ベクトル化
```http
POST /v1/datasets/{dataset_id}/documents/{document_id}/re-vectorize
```

---

## 参考リンク

- [要件定義書](../requirements.md) - D-005仕様
- [E2Eテスト仕様書](../e2e-specs/knowledge-base-e2e.md)
- [型定義](../../frontend/src/types/index.ts)
- [プロジェクト設定 (CLAUDE.md)](../../CLAUDE.md)
- [Dify API ドキュメント](https://docs.dify.ai/v/ja-jp/guides/knowledge-base)
- [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings)
- [Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)

---

**作成日**: 2025-11-02
**バージョン**: MVP v1.0
**次回更新予定**: Dify API統合時
