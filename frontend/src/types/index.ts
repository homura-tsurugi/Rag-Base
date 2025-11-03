// ============================================
// RAGベースAIコーチングbot - 型定義
// ============================================
// バックエンドと完全同期した型定義
// 参照: docs/requirements.md

// --------------------------------------------
// ユーザーロールと権限
// --------------------------------------------

export type UserRole = 'client' | 'coach';

export type MessageRole = 'user' | 'assistant';

export type DatasetType = 'system' | 'user';

export type AIMode = 'problem-solving' | 'learning-support' | 'planning' | 'companionship';

// --------------------------------------------
// ユーザー関連
// --------------------------------------------

export interface User {
  user_id: string; // UUID
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  created_at: string; // ISO 8601
  last_login_at?: string; // ISO 8601
}

// 認証レスポンス
export interface AuthResponse {
  token: string;
  user: User;
  expires_at: string; // ISO 8601
}

// ログインリクエスト
export interface LoginRequest {
  email: string;
  password: string;
}

// --------------------------------------------
// 会話・メッセージ関連
// --------------------------------------------

export interface Conversation {
  session_id: string; // UUID
  user_id: string;
  title?: string;
  created_at: string; // ISO 8601
  updated_at?: string; // ISO 8601
  message_count?: number;
  crisis_flag?: boolean; // 危機フラグ（D-006: 会話履歴管理用）
}

export interface Citation {
  source: string; // ドキュメント名
  content: string; // 引用テキスト
  dataset_type: DatasetType; // 'system' | 'user'
  chunk_number?: number; // チャンク番号（D-006: 会話履歴管理用）
  similarity_score?: number; // 類似度スコア 0-1（D-006: 会話履歴管理用）
}

// UI表示用の引用元情報（ChatPage用）
export interface CitationSource {
  name: string; // 表示名（例: "システムRAG", "ユーザーRAG"）
  icon: string; // Material Icons名（例: "book", "person"）
}

export interface Message {
  message_id: string; // UUID
  session_id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[]; // 引用元情報（バックエンド）
  citation_sources?: CitationSource[]; // UI表示用引用元（フロントエンド）
  created_at: string; // ISO 8601
  tokens_used?: number;
  timestamp?: string; // UI表示用のタイムスタンプ（例: "15:30"）
  crisis_detected?: boolean; // 危機キーワード検出フラグ（D-006: 会話履歴管理用）
}

// チャットメッセージ送信リクエスト
export interface ChatMessageRequest {
  session_id?: string; // 新規会話の場合は省略
  content: string;
  user_id?: string; // ユーザーID
}

// チャットメッセージレスポンス
export interface ChatMessageResponse {
  message: Message;
  session_id: string;
}

// --------------------------------------------
// 会話要約関連
// --------------------------------------------

export interface ConversationSummary {
  summary_id: string; // UUID
  session_id: string;
  user_id: string;
  topics: string[]; // 主なトピック
  problems: string[]; // 問題・課題
  advice: string[]; // 提供したアドバイス
  insights: string[]; // クライアントの気づき
  next_steps: string[]; // 次のステップ
  mentor_notes?: string; // メンターメモ（任意）
  crisis_flags?: string[]; // 危機フラグ（検出されたキーワード等）
  created_at: string; // ISO 8601
  updated_at?: string; // ISO 8601
}

// 会話要約生成リクエスト
export interface GenerateSummaryRequest {
  session_id: string;
  user_id: string;
  messages: Message[];
}

// 会話要約生成レスポンス
export interface GenerateSummaryResponse {
  summary: ConversationSummary;
  success: boolean;
  message?: string;
}

// --------------------------------------------
// UI関連（ChatPage）
// --------------------------------------------

// クイックプロンプト（モード別の定型質問）
export interface QuickPrompt {
  icon: string; // Material Icons名（例: "psychology", "lightbulb"）
  title: string; // タイトル（例: "問題を特定する"）
  desc: string; // 説明（例: "何が課題かを明確に"）
  prompt: string; // 実際に送信されるプロンプト
}

// モード別ウェルカムメッセージ
export interface WelcomeMessage {
  icon: string; // Material Icons名
  title: string; // モード名（例: "課題解決モード"）
  description: string; // 説明文
  quick_prompts: QuickPrompt[]; // クイックプロンプト一覧
}

// 会話グループ（日付別）
export interface ConversationGroup {
  title: string; // グループ名（例: "今日", "昨日", "今週"）
  conversations: ConversationListItem[]; // 会話一覧
}

// 会話リストアイテム（サイドバー表示用）
export interface ConversationListItem {
  session_id: string;
  title: string; // 会話タイトル
  preview: string; // 会話のプレビューテキスト
  time: string; // 表示用時刻（例: "15:30", "月曜日"）
  is_active?: boolean; // 現在選択中かどうか
}

// タイピングインジケーター状態
export interface TypingState {
  is_typing: boolean; // AI が入力中かどうか
  text?: string; // 表示テキスト（例: "AIが入力中..."）
}

// チャット画面の状態管理
export interface ChatPageState {
  current_mode: AIMode; // 現在のモード
  current_session_id?: string; // 現在の会話セッションID
  messages: Message[]; // メッセージ一覧
  is_typing: boolean; // AI入力中フラグ
  show_welcome: boolean; // ウェルカムメッセージ表示フラグ
  sidebar_open: boolean; // サイドバー開閉状態
}

// ボトムナビゲーションアイテム
export type NavigationType = 'home' | 'plan-do' | 'check-action' | 'learning' | 'history';

export interface NavigationItem {
  type: NavigationType;
  icon: string; // Material Icons名
  label: string; // 表示ラベル
  is_active?: boolean; // アクティブ状態
}

// モード別設定（ウェルカムメッセージとクイックプロンプトの完全な構成）
export interface ModeConfig {
  mode: AIMode;
  icon: string;
  title: string;
  description: string;
  quick_prompts: QuickPrompt[];
}

// モードタブ設定
export interface ModeTab {
  mode: AIMode;
  icon: string; // Material Icons名
  label: string; // タブラベル（例: "課題解決モード"）
  is_active?: boolean;
}

// --------------------------------------------
// ナレッジベース関連
// --------------------------------------------

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

// --------------------------------------------
// データエクスポート関連（COM:PASS側）
// --------------------------------------------

export interface ExportPeriod {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
}

export interface ExportDataRequest {
  user_id: string;
  period?: ExportPeriod; // 省略時は直近30日
}

// --------------------------------------------
// システム統計関連（管理ダッシュボード）
// --------------------------------------------

export interface SystemStats {
  total_users: number;
  total_conversations: number;
  total_messages: number;
  active_users_today: number;
  api_usage: {
    claude_tokens: number;
    openai_tokens: number;
  };
  uptime: number; // 秒
  knowledge_bases: {
    system_rag_documents: number;
    user_rag_documents: number;
  };
}

// 管理画面用：クライアント情報（拡張版）
export interface ClientInfo {
  user_id: string;
  name: string;
  email: string;
  last_login_at?: string;
  created_at: string;
  total_conversations: number;
  total_messages: number;
  crisis_flags: number; // 危機フラグ数
}

// --------------------------------------------
// プロンプト編集関連（D-007）
// --------------------------------------------

export interface Prompt {
  app_id: string; // UUID
  content: string; // プロンプトテキスト
  version: string; // バージョン番号（例: "1.3"）
  comment?: string; // バージョンコメント
  created_at: string; // ISO 8601
  updated_at?: string; // ISO 8601
  is_active: boolean; // 現在アクティブか
}

export interface PromptVersion {
  version_id: string; // UUID
  app_id: string;
  version: string; // バージョン番号
  content: string; // プロンプトテキスト
  comment: string; // 変更内容の説明
  created_at: string; // ISO 8601
}

export interface ABTestConfig {
  enabled: boolean;
  prompt_a_version: string; // バージョン番号
  prompt_b_version: string; // バージョン番号
  distribution_ratio_a: number; // 0-100（%）
  distribution_ratio_b: number; // 0-100（%）
}

export interface PromptTestRequest {
  app_id: string;
  prompt_content: string; // テスト用プロンプト
  test_message: string; // テストメッセージ
}

export interface PromptTestResponse {
  response: string; // AI応答
  citations?: Citation[]; // 引用元情報
  tokens_used?: number; // 使用トークン数
}

// --------------------------------------------
// API エラーレスポンス
// --------------------------------------------

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

// --------------------------------------------
// ページネーション
// --------------------------------------------

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// --------------------------------------------
// フォーム関連
// --------------------------------------------

export interface LoginFormData {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
  avatar?: string;
}

// --------------------------------------------
// COMPASS固有型（将来の統合用）
// --------------------------------------------

export type CompassPhase = 'plan' | 'do' | 'check' | 'action';

export interface CompassGoal {
  goal_id: string;
  title: string;
  description: string;
  phase: CompassPhase;
  created_at: string;
  updated_at?: string;
}

export interface CompassTask {
  task_id: string;
  goal_id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  created_at: string;
  updated_at?: string;
}

// --------------------------------------------
// ワークフロー関連（D-008）
// --------------------------------------------

export type NodeType =
  | 'user_input'
  | 'system_rag_search'
  | 'user_rag_search'
  | 'llm_call'
  | 'condition'
  | 'crisis_detector'
  | 'response'
  | 'coach_notification';

export interface NodePosition {
  x: number;
  y: number;
}

export interface CrisisDetectorConfig {
  keywords: string[]; // 危機キーワードリスト
  match_type: 'exact' | 'partial' | 'fuzzy'; // 検出方法
  case_sensitive: boolean; // 大文字小文字の区別
  output_variable: string; // 出力変数名
}

export interface RAGSearchConfig {
  top_k: number; // 検索結果数
  output_variable: string; // 出力変数名
}

export interface LLMCallConfig {
  model: string; // モデル名（例: "Claude 3.5 Haiku"）
  temperature: number; // 温度（0-1）
  max_tokens?: number; // 最大トークン数
}

export interface ConditionConfig {
  condition: string; // 条件式（例: "crisis_detected == true"）
}

export interface NotificationConfig {
  methods: ('email' | 'slack')[]; // 通知方法
  recipients?: string[]; // 受信者リスト
}

// ノード固有の設定を統合
export type NodeConfig =
  | CrisisDetectorConfig
  | RAGSearchConfig
  | LLMCallConfig
  | ConditionConfig
  | NotificationConfig
  | Record<string, unknown>;

export interface WorkflowNode {
  node_id: string; // UUID
  node_type: NodeType;
  name: string; // ノード表示名
  config: NodeConfig; // ノード固有の設定
  position: NodePosition; // キャンバス上の位置
}

export interface WorkflowConnection {
  connection_id: string; // UUID
  source_node_id: string; // 接続元ノードID
  target_node_id: string; // 接続先ノードID
  source_port?: string; // 接続元ポート（条件分岐等で使用）
  is_crisis_route?: boolean; // 危機検出ルートかどうか
}

export interface Workflow {
  workflow_id: string; // UUID
  app_id: string; // アプリID
  name: string; // ワークフロー名
  description?: string; // 説明
  nodes: WorkflowNode[]; // ノード配列
  connections: WorkflowConnection[]; // 接続配列
  is_active: boolean; // アクティブかどうか
  created_at: string; // ISO 8601
  updated_at?: string; // ISO 8601
}

export interface WorkflowTestRequest {
  workflow_id: string;
  test_input: string; // テスト用ユーザーメッセージ
}

export interface NodeExecutionLog {
  node_id: string;
  node_name: string;
  status: 'success' | 'error' | 'warning';
  output: string; // 実行結果テキスト
  execution_time_ms: number; // 実行時間（ミリ秒）
}

export interface WorkflowTestResult {
  workflow_id: string;
  test_input: string;
  execution_logs: NodeExecutionLog[]; // 各ノードの実行ログ
  final_output?: string; // 最終出力
  total_execution_time_ms: number; // 総実行時間
  crisis_detected?: boolean; // 危機検出フラグ
}

// --------------------------------------------
// API エンドポイント定義
// --------------------------------------------

export const API_PATHS = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    VERIFY_TOKEN: '/v1/auth/verify',
    REFRESH_TOKEN: '/v1/auth/refresh',
  },
  CHAT: {
    MESSAGES: '/v1/chat-messages',
    CONVERSATIONS: '/v1/conversations',
    CONVERSATION_DETAIL: (sessionId: string) => `/v1/conversations/${sessionId}`,
    DELETE_CONVERSATION: (sessionId: string) => `/v1/conversations/${sessionId}`,
  },
  DATASETS: {
    LIST: '/v1/datasets',
    DETAIL: (datasetId: string) => `/v1/datasets/${datasetId}`,
    DOCUMENTS: (datasetId: string) => `/v1/datasets/${datasetId}/documents`,
    DOCUMENT_DETAIL: (datasetId: string, documentId: string) =>
      `/v1/datasets/${datasetId}/documents/${documentId}`,
    SETTINGS: (datasetId: string) => `/v1/datasets/${datasetId}/settings`,
    SEARCH_TEST: (datasetId: string) => `/v1/datasets/${datasetId}/search-test`,
  },
  ADMIN: {
    SYSTEM_STATS: '/admin/system-stats',
    ALL_CONVERSATIONS: '/admin/conversations', // 全クライアントの会話一覧
    CONVERSATION_DETAIL: (sessionId: string) => `/admin/conversations/${sessionId}`, // 会話詳細
  },
  EXPORT: {
    USER_DATA: (userId: string) => `/api/admin/export/${userId}`,
  },
  USERS: {
    LIST: '/v1/users',
    DETAIL: (userId: string) => `/v1/users/${userId}`,
  },
  PROMPTS: {
    GET: (appId: string) => `/admin/app/${appId}/prompt`, // 現在のプロンプト取得
    UPDATE: (appId: string) => `/admin/app/${appId}/prompt`, // プロンプト更新
    VERSIONS: (appId: string) => `/admin/app/${appId}/prompt/versions`, // バージョン履歴取得
    TEST: (appId: string) => `/admin/app/${appId}/prompt/test`, // プロンプトテスト実行
    AB_TEST_CONFIG: (appId: string) => `/admin/app/${appId}/ab-test`, // A/Bテスト設定取得・更新
  },
  WORKFLOWS: {
    GET: (appId: string) => `/admin/app/${appId}/workflow`, // ワークフロー取得
    UPDATE: (appId: string) => `/admin/app/${appId}/workflow`, // ワークフロー更新
    TEST: (appId: string) => `/admin/app/${appId}/workflow/test`, // ワークフロー実行テスト
  },
} as const;

// --------------------------------------------
// ユーティリティ型
// --------------------------------------------

// APIリクエストの共通型
export type ApiRequest<T = Record<string, unknown>> = T;

// APIレスポンスの共通型
export type ApiResponse<T = Record<string, unknown>> = T;

// 非同期操作の状態
export type AsyncState = 'idle' | 'loading' | 'success' | 'error';
