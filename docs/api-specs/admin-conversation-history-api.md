# AdminConversationHistoryPage（D-006）API仕様書

作成日: 2025-11-02
対象ページ: /admin/conversation-history
バージョン: MVP v1.0

## 概要

本ドキュメントは、AdminConversationHistoryPage（会話履歴管理 - コーチ専用）で使用されるAPIエンドポイントの仕様を定義します。現在はモックサービス（`mockAdminConversationService.ts`）で実装されており、本番環境ではDify API（v1）に置き換えられます。

## エンドポイント一覧

| No | メソッド | エンドポイント | 用途 | モック関数 | 優先度 |
|----|---------|--------------|------|-----------|--------|
| 1 | GET | `/admin/conversations` | 全クライアントの会話一覧取得 | `mockGetAllConversations` | 高 |
| 2 | GET | `/admin/conversations/{session_id}/messages` | 会話詳細（メッセージ一覧）取得 | `mockGetConversationMessages` | 高 |

---

## API詳細仕様

---

### 1. 全クライアントの会話一覧取得 API

#### 基本情報
- **エンドポイント**: `GET /admin/conversations`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: 全クライアントのセッション一覧を取得（フィルタリング可能）

#### Request

##### Headers
```http
Authorization: Bearer {token}
```

##### Query Parameters
| パラメータ | 型 | 必須 | 説明 | 例 |
|----------|---|------|------|-----|
| `user_id` | string | - | クライアント別フィルター | `client1@example.com` |
| `crisis_flag` | boolean | - | 危機フラグフィルター | `true` |

##### Request Example
```http
# 全クライアントの会話一覧
GET /admin/conversations

# クライアント別フィルター
GET /admin/conversations?user_id=client1@example.com

# 危機フラグフィルター
GET /admin/conversations?crisis_flag=true

# 複数フィルター同時適用
GET /admin/conversations?user_id=client1@example.com&crisis_flag=true
```

#### Response

##### Success Response (200 OK)
```json
[
  {
    "session_id": "session-001",
    "user_id": "client1@example.com",
    "title": "client1@example.comとの会話 - 2025-11-01",
    "created_at": "2025-11-01T14:20:00Z",
    "updated_at": "2025-11-01T14:30:00Z",
    "message_count": 15,
    "crisis_flag": true
  },
  {
    "session_id": "session-002",
    "user_id": "client2@example.com",
    "title": "client2@example.comとの会話 - 2025-11-01",
    "created_at": "2025-11-01T10:00:00Z",
    "updated_at": "2025-11-01T10:15:00Z",
    "message_count": 8,
    "crisis_flag": false
  },
  {
    "session_id": "session-003",
    "user_id": "client1@example.com",
    "title": "client1@example.comとの会話 - 2025-10-30",
    "created_at": "2025-10-30T16:30:00Z",
    "updated_at": "2025-10-30T16:45:00Z",
    "message_count": 22,
    "crisis_flag": false
  }
]
```

##### Response Fields
| フィールド | 型 | 説明 | 例 |
|----------|---|------|-----|
| `session_id` | string (UUID) | セッションID | `"session-001"` |
| `user_id` | string | クライアントID（メールアドレス） | `"client1@example.com"` |
| `title` | string | セッション名 | `"client1@example.comとの会話 - 2025-11-01"` |
| `created_at` | string (ISO 8601) | セッション作成日時 | `"2025-11-01T14:20:00Z"` |
| `updated_at` | string (ISO 8601) | 最終更新日時 | `"2025-11-01T14:30:00Z"` |
| `message_count` | number | メッセージ数 | `15` |
| `crisis_flag` | boolean | 危機フラグ（セッション全体） | `true` |

##### 危機フラグ（crisis_flag）の仕様
- **true**: セッション内に危機キーワードが検出されたメッセージが1つ以上存在する
- **false**: 危機キーワードが検出されていない
- **UI表示**: 赤色アイコン（WarningIcon）+ 赤色左ボーダー（4px solid error.main）
- **検出ワード例**:
  - 「死にたい」「消えたい」「自殺」
  - 「眠れない」「眠れない日もあります」
  - 「職場に行くのが憂鬱」「行くのが怖い」

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
const MOCK_ALL_CONVERSATIONS: Conversation[] = [
  {
    session_id: 'session-001',
    user_id: 'client1@example.com',
    title: 'client1@example.comとの会話 - 2025-11-01',
    created_at: '2025-11-01T14:20:00Z',
    updated_at: '2025-11-01T14:30:00Z',
    message_count: 15,
    crisis_flag: true,
  },
  {
    session_id: 'session-002',
    user_id: 'client2@example.com',
    title: 'client2@example.comとの会話 - 2025-11-01',
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-01T10:15:00Z',
    message_count: 8,
    crisis_flag: false,
  },
  // ... 6件のセッション
];
```

##### 応答遅延
```typescript
await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms遅延
```

---

### 2. 会話詳細（メッセージ一覧）取得 API

#### 基本情報
- **エンドポイント**: `GET /admin/conversations/{session_id}/messages`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: 特定セッションのメッセージ一覧を取得（引用元情報、危機検出フラグ含む）

#### Request

##### Headers
```http
Authorization: Bearer {token}
```

##### Path Parameters
| パラメータ | 型 | 説明 | 例 |
|----------|---|------|-----|
| `session_id` | string (UUID) | セッションID | `"session-001"` |

##### Request Example
```http
GET /admin/conversations/session-001/messages
```

#### Response

##### Success Response (200 OK)
```json
[
  {
    "message_id": "message-001",
    "session_id": "session-001",
    "role": "user",
    "content": "最近、仕事のプレッシャーがひどくて、朝起きるのがつらいです。",
    "created_at": "2025-11-01T14:20:00Z",
    "timestamp": "14:20",
    "crisis_detected": false
  },
  {
    "message_id": "message-002",
    "session_id": "session-001",
    "role": "assistant",
    "content": "そうなんですね。プレッシャーを感じていらっしゃるんですね。具体的にどのような状況でプレッシャーを感じますか？",
    "citations": [
      {
        "source": "コーチング基礎理論.pdf",
        "content": "傾聴のスキルは、クライアントの真の課題を引き出すために重要です。",
        "dataset_type": "system",
        "chunk_number": 45,
        "similarity_score": 0.89
      },
      {
        "source": "client1のタスク履歴",
        "content": "先月のタスク管理状況を確認すると、複数のプロジェクトが同時進行していました。",
        "dataset_type": "user",
        "chunk_number": 12,
        "similarity_score": 0.82
      }
    ],
    "created_at": "2025-11-01T14:21:00Z",
    "timestamp": "14:21",
    "crisis_detected": false
  },
  {
    "message_id": "message-003",
    "session_id": "session-001",
    "role": "user",
    "content": "上司からの期待が大きすぎて、ミスが許されない気がします。最近は眠れない日もあります。",
    "created_at": "2025-11-01T14:23:00Z",
    "timestamp": "14:23",
    "crisis_detected": true
  },
  {
    "message_id": "message-004",
    "session_id": "session-001",
    "role": "assistant",
    "content": "眠れない日があるとのこと、心配ですね。睡眠不足は心身に大きな影響を与えます。専門家への相談も検討されてはいかがでしょうか。まずは、プレッシャーを軽減する方法を一緒に考えましょう。",
    "citations": [
      {
        "source": "心理学的アプローチ.pdf",
        "content": "睡眠障害はメンタルヘルスの重要な指標であり、適切な対応が必要です。",
        "dataset_type": "system",
        "chunk_number": 78,
        "similarity_score": 0.91
      }
    ],
    "created_at": "2025-11-01T14:24:00Z",
    "timestamp": "14:24",
    "crisis_detected": false
  }
]
```

##### Response Fields
| フィールド | 型 | 説明 | 例 |
|----------|---|------|-----|
| `message_id` | string (UUID) | メッセージID | `"message-001"` |
| `session_id` | string (UUID) | セッションID | `"session-001"` |
| `role` | string | ロール | `"user"` / `"assistant"` |
| `content` | string | メッセージ内容 | `"最近、仕事のプレッシャーが..."` |
| `citations` | Citation[] / null | 引用元情報（アシスタントメッセージのみ） | `[...]` |
| `created_at` | string (ISO 8601) | 作成日時 | `"2025-11-01T14:20:00Z"` |
| `timestamp` | string | UI表示用時刻 | `"14:20"` |
| `crisis_detected` | boolean | 危機キーワード検出フラグ | `true` |

##### Citation Fields
| フィールド | 型 | 説明 | 例 |
|----------|---|------|-----|
| `source` | string | ドキュメント名 | `"コーチング基礎理論.pdf"` |
| `content` | string | 引用テキスト | `"傾聴のスキルは..."` |
| `dataset_type` | string | データセット種別 | `"system"` / `"user"` |
| `chunk_number` | number | チャンク番号 | `45` |
| `similarity_score` | number | 類似度スコア（0-1） | `0.89` |

##### 危機検出フラグ（crisis_detected）の仕様
- **true**: メッセージ内に危機キーワードが検出された
- **false**: 危機キーワードが検出されていない
- **UI表示**: 赤色ボーダー（2px solid error.main）+ 赤色バッジ「危機キーワード検出」
- **検出アルゴリズム**: Difyワークフロー内でキーワードマッチング

##### 引用元情報（citations）の仕様
- **システムRAG**: `dataset_type: "system"` → 専門知識（コーチング理論体系）
- **ユーザーRAG**: `dataset_type: "user"` → 個別クライアントデータ（COM:PASSエクスポート）
- **表示形式**: Accordionで折りたたみ表示
- **表示内容**:
  - システムRAG: 「システムRAG: 「コーチング基礎理論.pdf」(チャンク 45)」
  - ユーザーRAG: 「ユーザーRAG: 「client1のタスク履歴」(チャンク 12)」
  - 類似度スコア: 0.89

##### Error Response (404 Not Found)
```json
{
  "error": "not_found",
  "message": "指定されたセッションが見つかりません",
  "status": 404
}
```

#### モック実装の挙動

##### 初期データ（session-001の例）
```typescript
const MOCK_MESSAGES: Record<string, Message[]> = {
  'session-001': [
    {
      message_id: 'message-001',
      session_id: 'session-001',
      role: 'user',
      content: '最近、仕事のプレッシャーがひどくて、朝起きるのがつらいです。',
      created_at: '2025-11-01T14:20:00Z',
      timestamp: '14:20',
      crisis_detected: false,
    },
    {
      message_id: 'message-002',
      session_id: 'session-001',
      role: 'assistant',
      content: 'そうなんですね。プレッシャーを感じていらっしゃるんですね。...',
      citations: [
        {
          source: 'コーチング基礎理論.pdf',
          content: '傾聴のスキルは、クライアントの真の課題を引き出すために重要です。',
          dataset_type: 'system',
          chunk_number: 45,
          similarity_score: 0.89,
        },
        {
          source: 'client1のタスク履歴',
          content: '先月のタスク管理状況を確認すると、複数のプロジェクトが同時進行していました。',
          dataset_type: 'user',
          chunk_number: 12,
          similarity_score: 0.82,
        },
      ],
      created_at: '2025-11-01T14:21:00Z',
      timestamp: '14:21',
      crisis_detected: false,
    },
    // ... 合計5メッセージ
  ],
};
```

##### 応答遅延
```typescript
await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms遅延
```

---

## データ型定義

### TypeScript型定義（frontend/src/types/index.ts）

```typescript
// 会話セッション
export interface Conversation {
  session_id: string; // UUID
  user_id: string;
  title?: string;
  created_at: string; // ISO 8601
  updated_at?: string; // ISO 8601
  message_count?: number;
  crisis_flag?: boolean; // 危機フラグ（D-006: 会話履歴管理用）
}

// 引用元情報
export interface Citation {
  source: string; // ドキュメント名
  content: string; // 引用テキスト
  dataset_type: DatasetType; // 'system' | 'user'
  chunk_number?: number; // チャンク番号（D-006: 会話履歴管理用）
  similarity_score?: number; // 類似度スコア 0-1（D-006: 会話履歴管理用）
}

// メッセージ
export interface Message {
  message_id: string; // UUID
  session_id: string;
  role: MessageRole; // 'user' | 'assistant'
  content: string;
  citations?: Citation[]; // 引用元情報（バックエンド）
  created_at: string; // ISO 8601
  tokens_used?: number;
  timestamp?: string; // UI表示用のタイムスタンプ（例: "15:30"）
  crisis_detected?: boolean; // 危機キーワード検出フラグ（D-006: 会話履歴管理用）
}

// データセット型
export type DatasetType = 'system' | 'user';

// メッセージロール
export type MessageRole = 'user' | 'assistant';

// APIエンドポイント定義
export const API_PATHS = {
  // ...
  ADMIN: {
    SYSTEM_STATS: '/admin/system-stats',
    ALL_CONVERSATIONS: '/admin/conversations', // 全クライアントの会話一覧
    CONVERSATION_DETAIL: (sessionId: string) => `/admin/conversations/${sessionId}`, // 会話詳細
  },
  // ...
} as const;
```

---

## エラーコード一覧

| HTTPステータス | エラーコード | メッセージ | 原因 |
|--------------|------------|-----------|------|
| 401 | `unauthorized` | 認証が必要です | 認証トークンなし |
| 403 | `forbidden` | コーチロールのみアクセス可能です | クライアントロールのアクセス |
| 404 | `not_found` | 指定されたセッションが見つかりません | 存在しないsession_id |
| 500 | `internal_server_error` | サーバーエラーが発生しました | サーバー内部エラー |

---

## セキュリティ

### アクセス制御
- **認証**: Bearerトークン必須
- **認可**: コーチロール（`role: "coach"`）のみアクセス可能
- **クライアントロール**: 403 Forbiddenエラーを返す
- **未認証ユーザー**: 401 Unauthorizedエラーを返す

### データ保護
- **会話履歴分離**: クライアントは自分の会話のみ閲覧可能（D-003）、コーチは全クライアントの会話を閲覧可能（D-006）
- **危機フラグの取り扱い**: コーチのみ閲覧可能、クライアントには非表示
- **引用元情報の取り扱い**: コーチのみ閲覧可能、クライアントには非表示（D-002では引用元表示なし）

### 実装例（バックエンド側）
```python
@app.route('/admin/conversations', methods=['GET'])
@require_auth
@require_role('coach')
def get_all_conversations():
    """
    全クライアントの会話一覧取得
    コーチロールのみアクセス可能
    """
    user_id_filter = request.args.get('user_id')
    crisis_flag_filter = request.args.get('crisis_flag', type=bool)

    # クエリ構築
    query = Conversation.query

    if user_id_filter:
        query = query.filter_by(user_id=user_id_filter)

    if crisis_flag_filter:
        query = query.filter_by(crisis_flag=True)

    conversations = query.order_by(Conversation.updated_at.desc()).all()

    return jsonify([conv.to_dict() for conv in conversations]), 200


@app.route('/admin/conversations/<session_id>/messages', methods=['GET'])
@require_auth
@require_role('coach')
def get_conversation_messages(session_id):
    """
    会話詳細（メッセージ一覧）取得
    コーチロールのみアクセス可能
    """
    # セッション存在確認
    conversation = Conversation.query.get(session_id)
    if not conversation:
        return jsonify({
            "error": "not_found",
            "message": "指定されたセッションが見つかりません",
            "status": 404
        }), 404

    # メッセージ取得
    messages = Message.query.filter_by(session_id=session_id).order_by(Message.created_at.asc()).all()

    return jsonify([msg.to_dict() for msg in messages]), 200
```

---

## パフォーマンス

### 応答時間目標
- **全クライアントの会話一覧取得**: 500ms以内
- **会話詳細（メッセージ一覧）取得**: 1秒以内

### キャッシング戦略
- **会話一覧**: キャッシュなし（都度実行）
- **メッセージ一覧**: キャッシュなし（都度実行）

### 最適化手法
- **データベースインデックス**: `conversations.user_id`, `conversations.crisis_flag`, `messages.session_id`
- **ページネーション**: MVP段階では未実装（全件取得）、本番化時に実装予定

---

## モックから本番APIへの移行

### @MOCK_TO_API マーカー

モックサービス内に以下のマーカーを記載します。

#### mockGetAllConversations
```typescript
/**
 * モック全クライアントの会話一覧取得
 * @MOCK_TO_API: GET {API_PATHS.ADMIN.ALL_CONVERSATIONS}
 * @returns 全クライアントの会話一覧
 */
```

#### mockGetConversationMessages
```typescript
/**
 * モックセッション詳細（メッセージ一覧）取得
 * @MOCK_TO_API: GET {API_PATHS.ADMIN.CONVERSATION_DETAIL(sessionId)}/messages
 * @param sessionId セッションID
 * @returns メッセージ一覧
 */
```

### 移行手順

#### 1. 本番サービス実装
```typescript
// frontend/src/services/api/adminConversationService.ts
import axios from 'axios';
import { API_PATHS } from '@/types';
import type { Conversation, Message } from '@/types';

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
 * 全クライアントの会話一覧取得
 */
export const getAllConversations = async (): Promise<Conversation[]> => {
  const response = await api.get(API_PATHS.ADMIN.ALL_CONVERSATIONS);
  return response.data;
};

/**
 * 会話詳細（メッセージ一覧）取得
 */
export const getConversationMessages = async (sessionId: string): Promise<Message[]> => {
  const response = await api.get(`${API_PATHS.ADMIN.CONVERSATION_DETAIL(sessionId)}/messages`);
  return response.data;
};
```

#### 2. AdminConversationHistoryPage内のimport変更
```typescript
// Before (モック)
import {
  mockGetAllConversations,
  mockGetConversationMessages,
} from '@/services/api/mockAdminConversationService';

// After (本番)
import {
  getAllConversations,
  getConversationMessages,
} from '@/services/api/adminConversationService';
```

---

## レート制限

### 制限値（MVP段階）
- **全クライアントの会話一覧**: 60リクエスト/分/ユーザー
- **会話詳細（メッセージ一覧）**: 60リクエスト/分/ユーザー

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
GET /admin/conversations?page=1&limit=50
```

### 2. ソート機能
```http
GET /admin/conversations?sort_by=updated_at&order=desc
```

### 3. 日付範囲フィルター
```http
GET /admin/conversations?start_date=2025-10-01&end_date=2025-10-31
```

### 4. メッセージ検索
```http
GET /admin/conversations/search?query=プレッシャー
```

---

## 参考リンク

- [要件定義書](../requirements.md) - D-006仕様（295-312行目）
- [E2Eテスト仕様書](../e2e-specs/admin-conversation-history-e2e.md)
- [型定義](../../frontend/src/types/index.ts)
- [プロジェクト設定 (CLAUDE.md)](../../CLAUDE.md)
- [Dify API ドキュメント](https://docs.dify.ai/v/ja-jp/guides/knowledge-base)

---

**作成日**: 2025-11-02
**バージョン**: MVP v1.0
**次回更新予定**: Dify API統合時
