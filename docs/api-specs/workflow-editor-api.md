# WorkflowEditorPage（D-008）API仕様書

作成日: 2025-11-02
対象ページ: /admin/workflow
バージョン: MVP v1.0

## 概要

本ドキュメントは、WorkflowEditorPage（ワークフロー編集ページ）で使用されるAPIエンドポイントの仕様を定義します。現在はモックサービス（`mockWorkflowService.ts`）で実装されており、本番環境ではDify APIに置き換えられます。

## エンドポイント一覧

| No | メソッド | エンドポイント | 用途 | モック関数 | 優先度 |
|----|---------|--------------|------|-----------|--------|
| 1 | GET | `/admin/app/{appId}/workflow` | ワークフロー取得 | `mockGetWorkflow` | 高 |
| 2 | PUT | `/admin/app/{appId}/workflow` | ワークフロー更新 | `mockUpdateWorkflow` | 中 |
| 3 | POST | `/admin/app/{appId}/workflow/test` | ワークフロー実行テスト | `mockTestWorkflow` | 高 |

---

## API詳細仕様

---

### 1. ワークフロー取得 API

#### 基本情報
- **エンドポイント**: `GET /admin/app/{appId}/workflow`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: Difyアプリに紐づくワークフロー設定を取得

#### Request

##### Headers
```http
Authorization: Bearer {token}
```

##### Path Parameters
| パラメータ | 型 | 必須 | 説明 | 例 |
|----------|---|------|------|-----|
| `appId` | string (UUID) | はい | DifyアプリケーションID | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |

##### Request Example
```http
GET /admin/app/a1b2c3d4-e5f6-7890-abcd-ef1234567890/workflow
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response

##### Success Response (200 OK)
```json
{
  "app_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "nodes": [
    {
      "id": "start-node",
      "type": "start",
      "name": "開始ノード",
      "position": { "x": 100, "y": 200 },
      "config": {
        "input_variable": "user_message"
      }
    },
    {
      "id": "crisis-detection-node",
      "type": "crisis_detection",
      "name": "危機検出（キーワードベース）",
      "position": { "x": 300, "y": 200 },
      "config": {
        "keywords": ["死にたい", "消えたい", "辛い", "苦しい", "助けて"],
        "detection_method": "keyword_match",
        "output_variable": "crisis_detected"
      }
    },
    {
      "id": "system-rag-retrieval-node",
      "type": "rag_retrieval",
      "name": "システムRAG取得",
      "position": { "x": 500, "y": 200 },
      "config": {
        "dataset_type": "system",
        "dataset_id": "system-coaching-theory",
        "query_variable": "user_message",
        "top_k": 5,
        "output_variable": "system_knowledge"
      }
    },
    {
      "id": "user-rag-retrieval-node",
      "type": "rag_retrieval",
      "name": "ユーザーRAG取得",
      "position": { "x": 700, "y": 200 },
      "config": {
        "dataset_type": "user",
        "dataset_id": "user-{user_id}",
        "query_variable": "user_message",
        "top_k": 3,
        "output_variable": "user_history"
      }
    },
    {
      "id": "prompt-generation-node",
      "type": "prompt_generation",
      "name": "プロンプト生成",
      "position": { "x": 900, "y": 200 },
      "config": {
        "template": "システムRAG: {{system_knowledge}}\nユーザーRAG: {{user_history}}\nユーザーメッセージ: {{user_message}}\n\nコーチングbot応答:",
        "input_variables": [
          "system_knowledge",
          "user_history",
          "user_message"
        ],
        "output_variable": "final_prompt"
      }
    },
    {
      "id": "llm-call-node",
      "type": "llm_call",
      "name": "LLM呼び出し（Claude）",
      "position": { "x": 1100, "y": 200 },
      "config": {
        "model": "claude-3-5-haiku-20241022",
        "prompt_variable": "final_prompt",
        "temperature": 0.7,
        "max_tokens": 1000,
        "output_variable": "ai_response"
      }
    },
    {
      "id": "coach-alert-node",
      "type": "coach_alert",
      "name": "コーチ通知",
      "position": { "x": 500, "y": 400 },
      "config": {
        "alert_type": "crisis",
        "message_template": "クライアント{{user_name}}から危機フラグが検出されました: {{user_message}}",
        "condition_variable": "crisis_detected",
        "notification_channels": ["email", "slack"]
      }
    },
    {
      "id": "end-node",
      "type": "end",
      "name": "終了ノード",
      "position": { "x": 1300, "y": 200 },
      "config": {
        "output_variable": "ai_response"
      }
    }
  ],
  "edges": [
    {
      "source": "start-node",
      "target": "crisis-detection-node"
    },
    {
      "source": "crisis-detection-node",
      "target": "system-rag-retrieval-node"
    },
    {
      "source": "crisis-detection-node",
      "target": "coach-alert-node",
      "condition": "crisis_detected === true"
    },
    {
      "source": "system-rag-retrieval-node",
      "target": "user-rag-retrieval-node"
    },
    {
      "source": "user-rag-retrieval-node",
      "target": "prompt-generation-node"
    },
    {
      "source": "prompt-generation-node",
      "target": "llm-call-node"
    },
    {
      "source": "llm-call-node",
      "target": "end-node"
    }
  ],
  "metadata": {
    "total_nodes": 8,
    "created_at": "2025-11-02T10:00:00Z",
    "updated_at": "2025-11-02T10:00:00Z",
    "version": "1.0"
  }
}
```

##### Response Fields
| フィールド | 型 | 説明 | 例 |
|----------|---|------|-----|
| `app_id` | string | DifyアプリケーションID | `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"` |
| `nodes` | array | ワークフローノード配列 | `[{...}, {...}]` |
| `nodes[].id` | string | ノードの一意識別子 | `"crisis-detection-node"` |
| `nodes[].type` | string | ノードタイプ（start/crisis_detection/rag_retrieval/prompt_generation/llm_call/coach_alert/end） | `"crisis_detection"` |
| `nodes[].name` | string | ノード表示名 | `"危機検出（キーワードベース）"` |
| `nodes[].position` | object | キャンバス上の座標 | `{ "x": 300, "y": 200 }` |
| `nodes[].config` | object | ノード固有の設定 | `{...}` |
| `edges` | array | ノード間の接続配列 | `[{...}, {...}]` |
| `edges[].source` | string | 接続元ノードID | `"start-node"` |
| `edges[].target` | string | 接続先ノードID | `"crisis-detection-node"` |
| `edges[].condition` | string | 接続条件（オプション） | `"crisis_detected === true"` |
| `metadata` | object | ワークフローのメタ情報 | `{...}` |
| `metadata.total_nodes` | number | ノード総数 | `8` |
| `metadata.created_at` | string | 作成日時（ISO8601） | `"2025-11-02T10:00:00Z"` |
| `metadata.updated_at` | string | 更新日時（ISO8601） | `"2025-11-02T10:00:00Z"` |
| `metadata.version` | string | ワークフローバージョン | `"1.0"` |

##### Response Fields Details

**nodes[].type: ノードタイプ一覧**
- `start`: 開始ノード（入力受付）
- `crisis_detection`: 危機検出ノード（キーワードマッチング）
- `rag_retrieval`: RAG取得ノード（システムRAG/ユーザーRAG）
- `prompt_generation`: プロンプト生成ノード（テンプレート組み立て）
- `llm_call`: LLM呼び出しノード（Claude API実行）
- `coach_alert`: コーチ通知ノード（危機時のメール/Slack通知）
- `end`: 終了ノード（最終出力）

**nodes[].config: ノード固有設定（タイプ別）**

*crisis_detection ノード*
```json
{
  "keywords": ["死にたい", "消えたい", "辛い", "苦しい", "助けて"],
  "detection_method": "keyword_match",
  "output_variable": "crisis_detected"
}
```

*rag_retrieval ノード*
```json
{
  "dataset_type": "system",
  "dataset_id": "system-coaching-theory",
  "query_variable": "user_message",
  "top_k": 5,
  "output_variable": "system_knowledge"
}
```

*llm_call ノード*
```json
{
  "model": "claude-3-5-haiku-20241022",
  "prompt_variable": "final_prompt",
  "temperature": 0.7,
  "max_tokens": 1000,
  "output_variable": "ai_response"
}
```

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

##### Error Response (404 Not Found)
```json
{
  "error": "not_found",
  "message": "指定されたアプリのワークフローが見つかりません",
  "status": 404
}
```

##### Error Response (500 Internal Server Error)
```json
{
  "error": "internal_server_error",
  "message": "ワークフローの取得に失敗しました",
  "status": 500
}
```

#### モック実装の挙動

##### 初期データ
モックサービスは上記のサンプルワークフロー（8ノード、7エッジ）を返します。

##### 応答遅延
```typescript
await new Promise((resolve) => setTimeout(resolve, 800)); // 800ms遅延
```

---

### 2. ワークフロー更新 API

#### 基本情報
- **エンドポイント**: `PUT /admin/app/{appId}/workflow`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: ワークフロー設定を更新（ノード追加・削除・設定変更）

#### Request

##### Headers
```http
Authorization: Bearer {token}
Content-Type: application/json
```

##### Path Parameters
| パラメータ | 型 | 必須 | 説明 | 例 |
|----------|---|------|------|-----|
| `appId` | string (UUID) | はい | DifyアプリケーションID | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |

##### Request Body
```json
{
  "nodes": [
    {
      "id": "start-node",
      "type": "start",
      "name": "開始ノード",
      "position": { "x": 100, "y": 200 },
      "config": {
        "input_variable": "user_message"
      }
    },
    {
      "id": "crisis-detection-node",
      "type": "crisis_detection",
      "name": "危機検出（キーワードベース）",
      "position": { "x": 300, "y": 200 },
      "config": {
        "keywords": ["死にたい", "消えたい", "辛い", "苦しい", "助けて", "自殺"],
        "detection_method": "keyword_match",
        "output_variable": "crisis_detected"
      }
    }
  ],
  "edges": [
    {
      "source": "start-node",
      "target": "crisis-detection-node"
    }
  ]
}
```

##### Request Body Fields
| フィールド | 型 | 必須 | 説明 | 例 |
|----------|---|------|------|-----|
| `nodes` | array | はい | 更新後のノード配列 | `[{...}]` |
| `edges` | array | はい | 更新後のエッジ配列 | `[{...}]` |

#### Response

##### Success Response (200 OK)
```json
{
  "success": true,
  "message": "ワークフローを更新しました",
  "workflow": {
    "app_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "nodes": [...],
    "edges": [...],
    "metadata": {
      "total_nodes": 8,
      "updated_at": "2025-11-02T15:30:00Z",
      "version": "1.1"
    }
  }
}
```

##### Response Fields
| フィールド | 型 | 説明 | 例 |
|----------|---|------|-----|
| `success` | boolean | 更新成功フラグ | `true` |
| `message` | string | 更新メッセージ | `"ワークフローを更新しました"` |
| `workflow` | object | 更新後のワークフロー全体 | `{...}` |

##### Error Response (400 Bad Request)
```json
{
  "error": "validation_error",
  "message": "ワークフローのバリデーションに失敗しました",
  "details": [
    {
      "field": "nodes",
      "error": "開始ノードが見つかりません"
    },
    {
      "field": "edges",
      "error": "接続元ノード「invalid-node」が存在しません"
    }
  ],
  "status": 400
}
```

##### Error Response (403 Forbidden)
```json
{
  "error": "forbidden",
  "message": "コーチロールのみワークフローを更新できます",
  "status": 403
}
```

##### Error Response (500 Internal Server Error)
```json
{
  "error": "internal_server_error",
  "message": "ワークフローの更新に失敗しました",
  "status": 500
}
```

#### バリデーションルール

##### ノードバリデーション
- **必須ノード**: `start`ノードと`end`ノードが必須
- **ノードID一意性**: すべてのノードIDは一意である必要がある
- **ノードタイプ**: 定義されたタイプのみ許可（start/crisis_detection/rag_retrieval/prompt_generation/llm_call/coach_alert/end）
- **position**: `x`と`y`の両方が正の整数

##### エッジバリデーション
- **存在確認**: `source`と`target`のノードIDが存在する
- **循環参照**: ワークフローに循環参照がないこと
- **孤立ノード**: すべてのノード（`start`と`end`以外）が少なくとも1つの入力と1つの出力を持つ

#### モック実装の挙動

##### 応答遅延
```typescript
await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms遅延
```

##### バリデーション
モックは簡易的なバリデーションを行い、`start`ノードと`end`ノードの存在を確認します。

---

### 3. ワークフロー実行テスト API

#### 基本情報
- **エンドポイント**: `POST /admin/app/{appId}/workflow/test`
- **認証**: 必須（Bearer Token、コーチロールのみ）
- **用途**: ワークフローをテスト入力で実行し、各ノードのログを取得

#### Request

##### Headers
```http
Authorization: Bearer {token}
Content-Type: application/json
```

##### Path Parameters
| パラメータ | 型 | 必須 | 説明 | 例 |
|----------|---|------|------|-----|
| `appId` | string (UUID) | はい | DifyアプリケーションID | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |

##### Request Body
```json
{
  "input": "最近、仕事のストレスで夜も眠れません。何か良い方法はありますか？"
}
```

##### Request Body Fields
| フィールド | 型 | 必須 | 説明 | 例 |
|----------|---|------|------|-----|
| `input` | string | はい | テスト入力メッセージ | `"最近、仕事のストレスで夜も眠れません。何か良い方法はありますか？"` |

#### Response

##### Success Response (200 OK)
```json
{
  "success": true,
  "execution_time_ms": 3245,
  "logs": [
    {
      "node_id": "start-node",
      "node_name": "開始ノード",
      "status": "success",
      "input": "最近、仕事のストレスで夜も眠れません。何か良い方法はありますか？",
      "output": {
        "user_message": "最近、仕事のストレスで夜も眠れません。何か良い方法はありますか？"
      },
      "execution_time_ms": 5
    },
    {
      "node_id": "crisis-detection-node",
      "node_name": "危機検出（キーワードベース）",
      "status": "success",
      "input": {
        "user_message": "最近、仕事のストレスで夜も眠れません。何か良い方法はありますか？"
      },
      "output": {
        "crisis_detected": false,
        "matched_keywords": []
      },
      "execution_time_ms": 12
    },
    {
      "node_id": "system-rag-retrieval-node",
      "node_name": "システムRAG取得",
      "status": "success",
      "input": {
        "query": "最近、仕事のストレスで夜も眠れません。何か良い方法はありますか？"
      },
      "output": {
        "system_knowledge": [
          {
            "content": "ストレス管理の基本: 1. 深呼吸とリラクゼーション...",
            "score": 0.92
          },
          {
            "content": "睡眠改善のアプローチ: 1. 規則正しい生活リズム...",
            "score": 0.88
          }
        ],
        "retrieved_count": 5
      },
      "execution_time_ms": 450
    },
    {
      "node_id": "user-rag-retrieval-node",
      "node_name": "ユーザーRAG取得",
      "status": "success",
      "input": {
        "query": "最近、仕事のストレスで夜も眠れません。何か良い方法はありますか？"
      },
      "output": {
        "user_history": [
          {
            "content": "過去のセッション記録: クライアントは以前もストレス管理について相談...",
            "score": 0.85
          }
        ],
        "retrieved_count": 3
      },
      "execution_time_ms": 320
    },
    {
      "node_id": "prompt-generation-node",
      "node_name": "プロンプト生成",
      "status": "success",
      "input": {
        "system_knowledge": [...],
        "user_history": [...],
        "user_message": "最近、仕事のストレスで夜も眠れません。何か良い方法はありますか？"
      },
      "output": {
        "final_prompt": "システムRAG: ストレス管理の基本...\nユーザーRAG: 過去のセッション記録...\nユーザーメッセージ: 最近、仕事のストレスで夜も眠れません。何か良い方法はありますか？\n\nコーチングbot応答:"
      },
      "execution_time_ms": 8
    },
    {
      "node_id": "llm-call-node",
      "node_name": "LLM呼び出し（Claude）",
      "status": "success",
      "input": {
        "prompt": "システムRAG: ストレス管理の基本..."
      },
      "output": {
        "ai_response": "仕事のストレスで睡眠に影響が出ているのですね。まず、寝る前のリラックスタイムを作ることをおすすめします。具体的には、以前のセッションでお話しした深呼吸法を試してみてください。また、寝る1時間前にはスマホやPCの画面を見ないようにすることも効果的です。どのような対策を試してみたいですか？",
        "tokens_used": 245
      },
      "execution_time_ms": 2400
    },
    {
      "node_id": "end-node",
      "node_name": "終了ノード",
      "status": "success",
      "input": {
        "ai_response": "仕事のストレスで睡眠に影響が出ているのですね..."
      },
      "output": {
        "final_output": "仕事のストレスで睡眠に影響が出ているのですね。まず、寝る前のリラックスタイムを作ることをおすすめします。具体的には、以前のセッションでお話しした深呼吸法を試してみてください。また、寝る1時間前にはスマホやPCの画面を見ないようにすることも効果的です。どのような対策を試してみたいですか？"
      },
      "execution_time_ms": 2
    },
    {
      "node_id": "coach-alert-node",
      "node_name": "コーチ通知",
      "status": "skipped",
      "input": null,
      "output": null,
      "execution_time_ms": 0,
      "skip_reason": "条件「crisis_detected === true」が満たされませんでした"
    }
  ],
  "final_output": "仕事のストレスで睡眠に影響が出ているのですね。まず、寝る前のリラックスタイムを作ることをおすすめします。具体的には、以前のセッションでお話しした深呼吸法を試してみてください。また、寝る1時間前にはスマホやPCの画面を見ないようにすることも効果的です。どのような対策を試してみたいですか？"
}
```

##### Response Fields
| フィールド | 型 | 説明 | 例 |
|----------|---|------|-----|
| `success` | boolean | 実行成功フラグ | `true` |
| `execution_time_ms` | number | 総実行時間（ミリ秒） | `3245` |
| `logs` | array | 各ノードの実行ログ配列 | `[{...}, {...}]` |
| `logs[].node_id` | string | ノードID | `"crisis-detection-node"` |
| `logs[].node_name` | string | ノード表示名 | `"危機検出（キーワードベース）"` |
| `logs[].status` | string | 実行ステータス（success/error/skipped） | `"success"` |
| `logs[].input` | any | ノードへの入力データ | `{...}` |
| `logs[].output` | any | ノードからの出力データ | `{...}` |
| `logs[].execution_time_ms` | number | ノード実行時間（ミリ秒） | `450` |
| `logs[].skip_reason` | string | スキップ理由（オプション） | `"条件が満たされませんでした"` |
| `final_output` | string | 最終出力（AIの応答テキスト） | `"仕事のストレスで睡眠に影響が出ているのですね..."` |

##### Response Fields Details

**logs[].status: 実行ステータス**
- `success`: ノードが正常に実行された
- `error`: ノード実行中にエラーが発生した
- `skipped`: 条件が満たされずスキップされた（例: 危機検出なしの場合のコーチ通知）

**危機検出時のレスポンス例**
```json
{
  "success": true,
  "execution_time_ms": 3450,
  "logs": [
    {
      "node_id": "crisis-detection-node",
      "node_name": "危機検出（キーワードベース）",
      "status": "success",
      "input": {
        "user_message": "もう死にたいです。消えてしまいたい。"
      },
      "output": {
        "crisis_detected": true,
        "matched_keywords": ["死にたい", "消えてしまいたい"]
      },
      "execution_time_ms": 15
    },
    {
      "node_id": "coach-alert-node",
      "node_name": "コーチ通知",
      "status": "success",
      "input": {
        "crisis_detected": true,
        "user_message": "もう死にたいです。消えてしまいたい。"
      },
      "output": {
        "alert_sent": true,
        "notification_channels": ["email", "slack"],
        "alert_id": "alert-12345"
      },
      "execution_time_ms": 280
    }
  ],
  "final_output": "..."
}
```

##### Error Response (400 Bad Request)
```json
{
  "error": "validation_error",
  "message": "テスト入力が空です",
  "status": 400
}
```

##### Error Response (500 Internal Server Error)
```json
{
  "error": "execution_error",
  "message": "ワークフローの実行中にエラーが発生しました",
  "details": {
    "node_id": "llm-call-node",
    "error": "Claude API接続タイムアウト"
  },
  "status": 500
}
```

#### モック実装の挙動

##### 応答遅延
```typescript
await new Promise((resolve) => setTimeout(resolve, 2000)); // 2000ms遅延
```

##### 危機キーワード検出
モックは以下のキーワードで危機検出をシミュレートします。
- `死にたい`、`消えたい`、`辛い`、`苦しい`、`助けて`

---

## データ型定義

### TypeScript型定義（frontend/src/types/index.ts）

```typescript
// ワークフローノード
export interface WorkflowNode {
  id: string;
  type: 'start' | 'crisis_detection' | 'rag_retrieval' | 'prompt_generation' | 'llm_call' | 'coach_alert' | 'end';
  name: string;
  position: {
    x: number;
    y: number;
  };
  config: Record<string, any>;
}

// ワークフローエッジ（接続）
export interface WorkflowEdge {
  source: string;
  target: string;
  condition?: string;
}

// ワークフロー全体
export interface Workflow {
  app_id: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata: {
    total_nodes: number;
    created_at: string;
    updated_at: string;
    version: string;
  };
}

// ワークフローテストリクエスト
export interface WorkflowTestRequest {
  input: string;
}

// ワークフロー実行ログ
export interface WorkflowExecutionLog {
  node_id: string;
  node_name: string;
  status: 'success' | 'error' | 'skipped';
  input: any;
  output: any;
  execution_time_ms: number;
  skip_reason?: string;
}

// ワークフローテスト結果
export interface WorkflowTestResult {
  success: boolean;
  execution_time_ms: number;
  logs: WorkflowExecutionLog[];
  final_output: string;
}

// APIエラーレスポンス
export interface ApiError {
  error: string;
  message: string;
  details?: any;
  status: number;
}

// API エンドポイント定義
export const API_PATHS = {
  // ...
  WORKFLOW: {
    GET_WORKFLOW: (appId: string) => `/admin/app/${appId}/workflow`,
    UPDATE_WORKFLOW: (appId: string) => `/admin/app/${appId}/workflow`,
    TEST_WORKFLOW: (appId: string) => `/admin/app/${appId}/workflow/test`,
  },
  // ...
} as const;
```

---

## 認証

### 認証方式
- **方式**: Bearer Token認証
- **ヘッダー**: `Authorization: Bearer {token}`
- **トークン取得**: ログインAPI（`POST /v1/auth/login`）で取得
- **トークン有効期限**: 24時間
- **ロール確認**: トークンに含まれる`role`クレームで判定（`coach`のみアクセス可能）

### 認証フロー
```mermaid
sequenceDiagram
    participant Client
    participant LoginAPI
    participant WorkflowAPI

    Client->>LoginAPI: POST /v1/auth/login
    LoginAPI-->>Client: { token, user: { role: "coach" }, expires_at }
    Client->>WorkflowAPI: GET /admin/app/{appId}/workflow (with Bearer token)
    WorkflowAPI->>WorkflowAPI: トークン検証
    WorkflowAPI->>WorkflowAPI: ロール確認（coach）
    WorkflowAPI-->>Client: { app_id, nodes, edges, metadata }
```

### エラーハンドリング
```typescript
// 401 Unauthorized: トークン期限切れ
if (error.status === 401) {
  // ログインページにリダイレクト
  window.location.href = '/login';
}

// 403 Forbidden: コーチロールではない
if (error.status === 403) {
  // クライアント向けチャットページにリダイレクト
  window.location.href = '/chat';
}
```

---

## レート制限

### 制限値（MVP段階）
- **ワークフロー取得**: 60リクエスト/分/ユーザー
- **ワークフロー更新**: 10リクエスト/分/ユーザー
- **ワークフロー実行テスト**: 10リクエスト/分/ユーザー（実行負荷が高いため制限強め）

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

## モックから本番APIへの移行

### @MOCK_TO_API マーカー

モックサービス内に以下のマーカーが記載されています。

#### mockGetWorkflow
```typescript
// @MOCK_TO_API: GET /admin/app/{appId}/workflow
// Response: Workflow
```

#### mockUpdateWorkflow
```typescript
// @MOCK_TO_API: PUT /admin/app/{appId}/workflow
// Request: { nodes: WorkflowNode[], edges: WorkflowEdge[] }
// Response: { success: boolean, workflow: Workflow }
```

#### mockTestWorkflow
```typescript
// @MOCK_TO_API: POST /admin/app/{appId}/workflow/test
// Request: WorkflowTestRequest
// Response: WorkflowTestResult
```

### 移行手順

#### 1. 本番サービス実装
```typescript
// frontend/src/services/api/workflowService.ts
import axios from 'axios';
import { API_PATHS } from '@/types';
import type { Workflow, WorkflowTestRequest, WorkflowTestResult } from '@/types';

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
 * ワークフロー取得
 * @param appId DifyアプリケーションID
 * @returns ワークフロー全体
 */
export const getWorkflow = async (appId: string): Promise<Workflow> => {
  const response = await api.get(API_PATHS.WORKFLOW.GET_WORKFLOW(appId));
  return response.data;
};

/**
 * ワークフロー更新
 * @param appId DifyアプリケーションID
 * @param workflow 更新後のワークフロー
 * @returns 更新成功フラグとワークフロー
 */
export const updateWorkflow = async (
  appId: string,
  workflow: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }
): Promise<{ success: boolean; workflow: Workflow }> => {
  const response = await api.put(API_PATHS.WORKFLOW.UPDATE_WORKFLOW(appId), workflow);
  return response.data;
};

/**
 * ワークフロー実行テスト
 * @param appId DifyアプリケーションID
 * @param request テストリクエスト
 * @returns テスト実行結果
 */
export const testWorkflow = async (
  appId: string,
  request: WorkflowTestRequest
): Promise<WorkflowTestResult> => {
  const response = await api.post(API_PATHS.WORKFLOW.TEST_WORKFLOW(appId), request);
  return response.data;
};
```

#### 2. WorkflowEditorPage内のimport変更
```typescript
// Before (モック)
import { mockGetWorkflow, mockTestWorkflow } from '@/services/api/mockWorkflowService';

// After (本番)
import { getWorkflow, testWorkflow } from '@/services/api/workflowService';
```

---

## セキュリティ

### アクセス制御
- **認証**: Bearerトークン必須
- **認可**: コーチロール（`role: "coach"`）のみアクセス可能
- **クライアントロール**: 403 Forbiddenエラーを返す
- **未認証ユーザー**: 401 Unauthorizedエラーを返す

### ワークフロー更新の制限
- **バリデーション**: 悪意のあるノード設定を防ぐため、サーバー側でバリデーション実施
- **ノードタイプ制限**: 定義されたノードタイプ以外は拒否
- **変数インジェクション防止**: ノード設定内の変数名を検証

### 実装例（バックエンド側）
```python
@app.route('/admin/app/<app_id>/workflow', methods=['GET'])
@require_auth
@require_role('coach')
def get_workflow(app_id):
    """
    ワークフロー取得エンドポイント
    コーチロールのみアクセス可能
    """
    try:
        workflow = fetch_workflow_from_dify(app_id)
        return jsonify(workflow), 200
    except Exception as e:
        logger.error(f"Failed to fetch workflow: {e}")
        return jsonify({
            "error": "internal_server_error",
            "message": "ワークフローの取得に失敗しました",
            "status": 500
        }), 500
```

---

## パフォーマンス最適化

### 応答時間目標
- **ワークフロー取得**: 800ms以内
- **ワークフロー更新**: 1秒以内
- **ワークフロー実行テスト**: 3-5秒以内（LLM呼び出しを含むため）

### キャッシング戦略
- **キャッシュTTL**: 5分（ワークフロー取得のみ）
- **キャッシュキー**: `workflow-{app_id}`
- **キャッシュ無効化**: ワークフロー更新時にキャッシュクリア

### 実装例（Redis キャッシング）
```python
import redis
import json
from datetime import timedelta

redis_client = redis.Redis(host='localhost', port=6379, db=0)
CACHE_TTL = timedelta(minutes=5)

@app.route('/admin/app/<app_id>/workflow', methods=['GET'])
@require_auth
@require_role('coach')
def get_workflow(app_id):
    # キャッシュチェック
    cache_key = f"workflow-{app_id}"
    cached_workflow = redis_client.get(cache_key)
    if cached_workflow:
        return jsonify(json.loads(cached_workflow)), 200

    # キャッシュミス時はDifyから取得
    workflow = fetch_workflow_from_dify(app_id)

    # キャッシュに保存
    redis_client.setex(cache_key, CACHE_TTL, json.dumps(workflow))

    return jsonify(workflow), 200
```

---

## 本番環境での拡張機能（MVP後）

### 1. ワークフローバージョン管理
```http
GET /admin/app/{appId}/workflow/versions
POST /admin/app/{appId}/workflow/rollback/{version}
```

### 2. ワークフロー実行統計
```http
GET /admin/app/{appId}/workflow/analytics?start_date=2025-11-01&end_date=2025-11-30
```

### 3. A/Bテスト機能
```http
POST /admin/app/{appId}/workflow/ab-test
```

---

## 参考リンク

- [要件定義書](../requirements.md) - D-008仕様
- [E2Eテスト仕様書](../e2e-specs/workflow-editor-e2e.md)
- [WorkflowEditorPage実装](../../frontend/src/pages/WorkflowEditorPage/index.tsx)
- [モックサービス](../../frontend/src/services/api/mockWorkflowService.ts)
- [型定義](../../frontend/src/types/index.ts)
- [プロジェクト設定 (CLAUDE.md)](../../CLAUDE.md)

---

**作成日**: 2025-11-02
**バージョン**: MVP v1.0
**次回更新予定**: Dify API統合時
