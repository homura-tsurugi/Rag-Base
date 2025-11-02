// ============================================
// モック管理サービス
// ============================================
// MVP段階での開発・テスト用モック管理API
// 本番環境では adminService.ts に切り替え

import type {
  SystemStats,
  ClientInfo,
  Conversation,
  KnowledgeBase,
  Document,
  DocumentUploadRequest,
} from '@/types';

// --------------------------------------------
// モックシステム統計データ
// --------------------------------------------

const MOCK_SYSTEM_STATS: SystemStats = {
  total_users: 28,
  total_conversations: 156,
  total_messages: 1247,
  active_users_today: 12,
  api_usage: {
    claude_tokens: 45230,
    openai_tokens: 12890,
  },
  uptime: 2592000, // 30日分の秒数
  knowledge_bases: {
    system_rag_documents: 45,
    user_rag_documents: 28,
  },
};

// --------------------------------------------
// モッククライアントデータ
// --------------------------------------------

const MOCK_CLIENTS: ClientInfo[] = [
  {
    user_id: 'client-001',
    name: '田中太郎',
    email: 'tanaka@example.com',
    last_login_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    total_conversations: 15,
    total_messages: 87,
    crisis_flags: 0,
  },
  {
    user_id: 'client-002',
    name: '佐藤花子',
    email: 'sato@example.com',
    last_login_at: new Date(Date.now() - 3600000).toISOString(),
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    total_conversations: 22,
    total_messages: 134,
    crisis_flags: 1,
  },
  {
    user_id: 'client-003',
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    last_login_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    total_conversations: 8,
    total_messages: 45,
    crisis_flags: 0,
  },
];

// --------------------------------------------
// モックナレッジベースデータ
// --------------------------------------------

const MOCK_KNOWLEDGE_BASES: KnowledgeBase[] = [
  {
    dataset_id: 'kb-system-001',
    name: 'システムRAG - コーチング理論体系',
    type: 'system',
    embedding_model: 'text-embedding-3-small',
    chunk_size: 500,
    overlap: 50,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    total_documents: 45,
    total_chunks: 1230,
  },
  {
    dataset_id: 'kb-user-001',
    name: 'ユーザーRAG_client-001',
    type: 'user',
    embedding_model: 'text-embedding-3-small',
    chunk_size: 500,
    overlap: 50,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    total_documents: 12,
    total_chunks: 234,
  },
];

// --------------------------------------------
// モックドキュメントデータ
// --------------------------------------------

const MOCK_DOCUMENTS: Record<string, Document[]> = {
  'kb-system-001': [
    {
      document_id: 'doc-001',
      dataset_id: 'kb-system-001',
      filename: 'コーチング理論体系.pdf',
      file_type: 'pdf',
      uploaded_at: new Date(Date.now() - 90 * 86400000).toISOString(),
      vectorized_at: new Date(Date.now() - 90 * 86400000).toISOString(),
      chunk_count: 234,
      status: 'completed',
    },
    {
      document_id: 'doc-002',
      dataset_id: 'kb-system-001',
      filename: 'GROWモデル詳解.pdf',
      file_type: 'pdf',
      uploaded_at: new Date(Date.now() - 85 * 86400000).toISOString(),
      vectorized_at: new Date(Date.now() - 85 * 86400000).toISOString(),
      chunk_count: 156,
      status: 'completed',
    },
    {
      document_id: 'doc-003',
      dataset_id: 'kb-system-001',
      filename: 'リフレクション技法.pdf',
      file_type: 'pdf',
      uploaded_at: new Date(Date.now() - 80 * 86400000).toISOString(),
      vectorized_at: new Date(Date.now() - 80 * 86400000).toISOString(),
      chunk_count: 123,
      status: 'completed',
    },
  ],
  'kb-user-001': [
    {
      document_id: 'doc-u-001',
      dataset_id: 'kb-user-001',
      filename: '田中太郎_目標設定.md',
      file_type: 'txt',
      uploaded_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      vectorized_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      chunk_count: 45,
      status: 'completed',
    },
    {
      document_id: 'doc-u-002',
      dataset_id: 'kb-user-001',
      filename: '田中太郎_振り返りログ.md',
      file_type: 'txt',
      uploaded_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      vectorized_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      chunk_count: 67,
      status: 'completed',
    },
  ],
};

// --------------------------------------------
// モック管理API
// --------------------------------------------

/**
 * モックシステム統計取得
 * @returns システム統計情報
 */
export const mockGetSystemStats = async (): Promise<SystemStats> => {
  // @MOCK_TO_API: GET {API_PATHS.ADMIN.SYSTEM_STATS}
  // Response: SystemStats

  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_SYSTEM_STATS;
};

/**
 * モッククライアント一覧取得
 * @returns クライアント情報一覧
 */
export const mockGetClients = async (): Promise<ClientInfo[]> => {
  // @MOCK_TO_API: GET {API_PATHS.USERS.LIST}
  // Response: ClientInfo[]

  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_CLIENTS;
};

/**
 * モック全クライアントの会話一覧取得
 * @returns 会話一覧
 */
export const mockGetAllConversations = async (): Promise<Conversation[]> => {
  // @MOCK_TO_API: GET {API_PATHS.ADMIN.ALL_CONVERSATIONS}
  // Response: Conversation[]

  await new Promise((resolve) => setTimeout(resolve, 500));

  // 各クライアントの会話を生成
  const conversations: Conversation[] = [];
  MOCK_CLIENTS.forEach((client) => {
    for (let i = 0; i < client.total_conversations; i++) {
      conversations.push({
        session_id: `session-${client.user_id}-${i}`,
        user_id: client.user_id,
        title: `${client.name}の会話 ${i + 1}`,
        created_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
        updated_at: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
        message_count: Math.floor(Math.random() * 20) + 5,
        crisis_flag: client.crisis_flags > 0 && i === 0,
      });
    }
  });

  return conversations;
};

/**
 * モックナレッジベース一覧取得
 * @returns ナレッジベース一覧
 */
export const mockGetKnowledgeBases = async (): Promise<KnowledgeBase[]> => {
  // @MOCK_TO_API: GET {API_PATHS.DATASETS.LIST}
  // Response: KnowledgeBase[]

  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_KNOWLEDGE_BASES;
};

/**
 * モックドキュメント一覧取得
 * @param datasetId データセットID
 * @returns ドキュメント一覧
 */
export const mockGetDocuments = async (datasetId: string): Promise<Document[]> => {
  // @MOCK_TO_API: GET {API_PATHS.DATASETS.DOCUMENTS(datasetId)}
  // Response: Document[]

  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_DOCUMENTS[datasetId] || [];
};

/**
 * モックドキュメントアップロード
 * @param request アップロードリクエスト
 * @returns アップロードされたドキュメント
 */
export const mockUploadDocument = async (
  request: DocumentUploadRequest
): Promise<Document> => {
  // @MOCK_TO_API: POST {API_PATHS.DATASETS.DOCUMENTS(request.dataset_id)}
  // Request: DocumentUploadRequest
  // Response: Document

  await new Promise((resolve) => setTimeout(resolve, 2000)); // アップロードシミュレーション

  const newDocument: Document = {
    document_id: `doc-${Date.now()}`,
    dataset_id: request.dataset_id,
    filename: request.file.name,
    file_type: request.file.name.split('.').pop() || 'txt',
    uploaded_at: new Date().toISOString(),
    vectorized_at: new Date().toISOString(),
    chunk_count: Math.floor(Math.random() * 100) + 20,
    status: 'completed',
  };

  // モックストアに追加
  if (!MOCK_DOCUMENTS[request.dataset_id]) {
    MOCK_DOCUMENTS[request.dataset_id] = [];
  }
  MOCK_DOCUMENTS[request.dataset_id].push(newDocument);

  return newDocument;
};

/**
 * モックドキュメント削除
 * @param datasetId データセットID
 * @param documentId ドキュメントID
 */
export const mockDeleteDocument = async (
  datasetId: string,
  documentId: string
): Promise<void> => {
  // @MOCK_TO_API: DELETE {API_PATHS.DATASETS.DOCUMENT_DETAIL(datasetId, documentId)}
  // Response: void

  await new Promise((resolve) => setTimeout(resolve, 500));

  // モックストアから削除
  if (MOCK_DOCUMENTS[datasetId]) {
    const index = MOCK_DOCUMENTS[datasetId].findIndex((doc) => doc.document_id === documentId);
    if (index !== -1) {
      MOCK_DOCUMENTS[datasetId].splice(index, 1);
    }
  }
};
