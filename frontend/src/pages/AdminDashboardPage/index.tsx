// ============================================
// AdminDashboardPage - コーチ向け管理ダッシュボード
// ============================================
// 強化版：統計 + クライアント管理 + 会話履歴 + RAG管理

import { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  People as PeopleIcon,
  ChatBubble as ChatBubbleIcon,
  Message as MessageIcon,
  Cloud as CloudIcon,
  Folder as FolderIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/layouts/MainLayout';
import {
  mockGetSystemStats,
  mockGetClients,
  mockGetAllConversations,
  mockGetKnowledgeBases,
  mockGetDocuments,
  mockUploadDocument,
  mockDeleteDocument,
} from '@/services/api/mockAdminService';
import { getMessages } from '@/services/api/chatService';
import type {
  SystemStats,
  ClientInfo,
  Conversation,
  KnowledgeBase,
  Document,
  Message,
} from '@/types';

// タブ定義
type TabType = 'stats' | 'clients' | 'conversations' | 'rag';

export const AdminDashboardPage = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('stats');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // データ状態
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedKB, setSelectedKB] = useState<string | null>(null);

  // 会話詳細ダイアログ
  const [conversationDialog, setConversationDialog] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);

  // データ読み込み
  useEffect(() => {
    loadData();
  }, [currentTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      switch (currentTab) {
        case 'stats':
          const statsData = await mockGetSystemStats();
          setStats(statsData);
          break;
        case 'clients':
          const clientsData = await mockGetClients();
          setClients(clientsData);
          break;
        case 'conversations':
          const conversationsData = await mockGetAllConversations();
          setConversations(conversationsData);
          break;
        case 'rag':
          const kbData = await mockGetKnowledgeBases();
          setKnowledgeBases(kbData);
          if (kbData.length > 0 && !selectedKB) {
            const firstKB = kbData[0].dataset_id;
            setSelectedKB(firstKB);
            const docsData = await mockGetDocuments(firstKB);
            setDocuments(docsData);
          }
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '読み込みエラー');
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (datasetId: string) => {
    setSelectedKB(datasetId);
    setLoading(true);
    try {
      const docsData = await mockGetDocuments(datasetId);
      setDocuments(docsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ドキュメント読み込みエラー');
    } finally {
      setLoading(false);
    }
  };

  const handleViewConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setConversationDialog(true);
    setLoading(true);
    try {
      const messages = await getMessages(conversation.session_id);
      setConversationMessages(messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'メッセージ読み込みエラー');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (file: File) => {
    if (!selectedKB) return;
    setLoading(true);
    try {
      await mockUploadDocument({ dataset_id: selectedKB, file });
      await loadDocuments(selectedKB);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'アップロードエラー');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!selectedKB) return;
    setLoading(true);
    try {
      await mockDeleteDocument(selectedKB, documentId);
      await loadDocuments(selectedKB);
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除エラー');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          管理ダッシュボード
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Tabs value={currentTab} onChange={(_, value) => setCurrentTab(value)} sx={{ mb: 3 }}>
          <Tab value="stats" label="統計" icon={<CloudIcon />} iconPosition="start" />
          <Tab value="clients" label="クライアント" icon={<PeopleIcon />} iconPosition="start" />
          <Tab
            value="conversations"
            label="会話履歴"
            icon={<ChatBubbleIcon />}
            iconPosition="start"
          />
          <Tab value="rag" label="RAG管理" icon={<FolderIcon />} iconPosition="start" />
        </Tabs>

        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {/* 統計タブ */}
        {currentTab === 'stats' && stats && !loading && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">ユーザー数</Typography>
                  </Box>
                  <Typography variant="h3">{stats.total_users}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    今日のアクティブ: {stats.active_users_today}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ChatBubbleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">会話数</Typography>
                  </Box>
                  <Typography variant="h3">{stats.total_conversations}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <MessageIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">メッセージ数</Typography>
                  </Box>
                  <Typography variant="h3">{stats.total_messages}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <FolderIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">RAGドキュメント</Typography>
                  </Box>
                  <Typography variant="h3">
                    {stats.knowledge_bases.system_rag_documents +
                      stats.knowledge_bases.user_rag_documents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    システム: {stats.knowledge_bases.system_rag_documents} / ユーザー:{' '}
                    {stats.knowledge_bases.user_rag_documents}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* クライアントタブ */}
        {currentTab === 'clients' && !loading && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>名前</TableCell>
                  <TableCell>メール</TableCell>
                  <TableCell>最終ログイン</TableCell>
                  <TableCell align="right">会話数</TableCell>
                  <TableCell align="right">メッセージ数</TableCell>
                  <TableCell align="center">危機フラグ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.user_id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      {client.last_login_at
                        ? new Date(client.last_login_at).toLocaleString('ja-JP')
                        : '-'}
                    </TableCell>
                    <TableCell align="right">{client.total_conversations}</TableCell>
                    <TableCell align="right">{client.total_messages}</TableCell>
                    <TableCell align="center">
                      {client.crisis_flags > 0 ? (
                        <Chip
                          label={`${client.crisis_flags}件`}
                          color="error"
                          size="small"
                          icon={<WarningIcon />}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          なし
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* 会話履歴タブ */}
        {currentTab === 'conversations' && !loading && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>タイトル</TableCell>
                  <TableCell>ユーザーID</TableCell>
                  <TableCell>最終更新</TableCell>
                  <TableCell align="right">メッセージ数</TableCell>
                  <TableCell align="center">危機フラグ</TableCell>
                  <TableCell align="center">アクション</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conversations.map((conv) => (
                  <TableRow key={conv.session_id}>
                    <TableCell>{conv.title || '無題の会話'}</TableCell>
                    <TableCell>{conv.user_id}</TableCell>
                    <TableCell>
                      {conv.updated_at
                        ? new Date(conv.updated_at).toLocaleString('ja-JP')
                        : '-'}
                    </TableCell>
                    <TableCell align="right">{conv.message_count || 0}</TableCell>
                    <TableCell align="center">
                      {conv.crisis_flag && <Chip label="危機" color="error" size="small" />}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleViewConversation(conv)} size="small">
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* RAG管理タブ */}
        {currentTab === 'rag' && !loading && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  ナレッジベース
                </Typography>
                <List>
                  {knowledgeBases.map((kb) => (
                    <ListItem
                      key={kb.dataset_id}
                      onClick={() => loadDocuments(kb.dataset_id)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: selectedKB === kb.dataset_id ? 'action.selected' : 'transparent',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemText
                        primary={kb.name}
                        secondary={`${kb.total_documents} ドキュメント`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Paper sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">ドキュメント一覧</Typography>
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    component="label"
                    disabled={!selectedKB}
                  >
                    アップロード
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadDocument(file);
                      }}
                    />
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ファイル名</TableCell>
                        <TableCell>タイプ</TableCell>
                        <TableCell>アップロード日時</TableCell>
                        <TableCell align="right">チャンク数</TableCell>
                        <TableCell align="center">ステータス</TableCell>
                        <TableCell align="center">アクション</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.document_id}>
                          <TableCell>{doc.filename}</TableCell>
                          <TableCell>{doc.file_type.toUpperCase()}</TableCell>
                          <TableCell>
                            {new Date(doc.uploaded_at).toLocaleString('ja-JP')}
                          </TableCell>
                          <TableCell align="right">{doc.chunk_count}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={doc.status}
                              color={doc.status === 'completed' ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => handleDeleteDocument(doc.document_id)}
                              size="small"
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* 会話詳細ダイアログ */}
        <Dialog
          open={conversationDialog}
          onClose={() => setConversationDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{selectedConversation?.title || '会話詳細'}</DialogTitle>
          <DialogContent>
            {conversationMessages.map((msg) => (
              <Box
                key={msg.message_id}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: msg.role === 'user' ? 'grey.100' : 'primary.50',
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {msg.role === 'user' ? 'ユーザー' : 'AI'}
                </Typography>
                <Typography variant="body1">{msg.content}</Typography>
                {msg.citations && msg.citations.length > 0 && (
                  <Box mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      引用元: {msg.citations.map((c) => c.source).join(', ')}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConversationDialog(false)}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};
