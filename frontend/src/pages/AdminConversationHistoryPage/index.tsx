// ============================================
// AdminConversationHistoryPage - 会話履歴管理（コーチ専用）
// ============================================
// D-006: 会話履歴管理
// 全クライアントの会話を確認し、必要に応じて介入準備

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Warning as WarningIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  ExpandMore as ExpandMoreIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/layouts/MainLayout';
import type { Conversation, Message } from '@/types';
import {
  mockGetAllConversations,
  mockGetConversationMessages,
} from '@/services/api/mockAdminConversationService';

// --------------------------------------------
// AdminConversationHistoryPage コンポーネント
// --------------------------------------------

export const AdminConversationHistoryPage = () => {
  // ステート管理
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [selectedSession, setSelectedSession] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [crisisFlagFilter, setCrisisFlagFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 全会話一覧取得
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await mockGetAllConversations();
        setConversations(data);
        setFilteredConversations(data);

        // 初回読み込み時に最初のセッションを選択
        if (data.length > 0) {
          setSelectedSession(data[0]);
        }
      } catch (err) {
        setError('会話一覧の取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // フィルタリング処理
  useEffect(() => {
    let filtered = conversations;

    // クライアントフィルター
    if (clientFilter !== 'all') {
      filtered = filtered.filter((conv) => conv.user_id === clientFilter);
    }

    // 危機フラグフィルター
    if (crisisFlagFilter) {
      filtered = filtered.filter((conv) => conv.crisis_flag);
    }

    // 検索クエリフィルター
    if (searchQuery) {
      filtered = filtered.filter((conv) =>
        conv.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredConversations(filtered);
  }, [clientFilter, crisisFlagFilter, searchQuery, conversations]);

  // セッション詳細（メッセージ）取得
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedSession) {
        setMessages([]);
        return;
      }

      try {
        const data = await mockGetConversationMessages(selectedSession.session_id);
        setMessages(data);
      } catch (err) {
        setError('メッセージの取得に失敗しました');
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedSession]);

  // クライアント一覧抽出（重複なし）
  const uniqueClients = Array.from(new Set(conversations.map((conv) => conv.user_id)));

  // セッション選択ハンドラー
  const handleSessionSelect = (session: Conversation) => {
    setSelectedSession(session);
  };

  // 日時フォーマット関数
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        {/* ページヘッダー */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 500 }}>
          会話履歴管理
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 2カラムレイアウト */}
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
          {/* 左カラム: セッション一覧 + フィルター */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* フィルターセクション */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                {/* クライアント選択 */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>クライアント選択</InputLabel>
                  <Select
                    value={clientFilter}
                    label="クライアント選択"
                    onChange={(e) => setClientFilter(e.target.value)}
                  >
                    <MenuItem value="all">全クライアント</MenuItem>
                    {uniqueClients.map((client) => (
                      <MenuItem key={client} value={client}>
                        {client}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* 危機フラグフィルター */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={crisisFlagFilter}
                      onChange={(e) => setCrisisFlagFilter(e.target.checked)}
                    />
                  }
                  label="危機フラグのみ表示"
                  sx={{ mb: 2 }}
                />

                {/* セッション名検索 */}
                <TextField
                  fullWidth
                  placeholder="セッション名で検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                />
              </Box>

              {/* セッション一覧 */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {filteredConversations.length === 0 ? (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    該当するセッションがありません
                  </Typography>
                ) : (
                  filteredConversations.map((conv) => (
                    <Card
                      key={conv.session_id}
                      onClick={() => handleSessionSelect(conv)}
                      sx={{
                        mb: 2,
                        p: 2,
                        cursor: 'pointer',
                        border: 2,
                        borderColor:
                          selectedSession?.session_id === conv.session_id
                            ? 'primary.main'
                            : 'transparent',
                        borderLeft: conv.crisis_flag ? '4px solid' : '2px solid',
                        borderLeftColor: conv.crisis_flag ? 'error.main' : 'transparent',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      {/* セッション名 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {conv.crisis_flag && (
                          <WarningIcon sx={{ color: 'error.main', fontSize: 20, mr: 0.5 }} />
                        )}
                        <Typography variant="body1" sx={{ fontWeight: 500, flex: 1 }}>
                          {conv.title}
                        </Typography>
                      </Box>

                      {/* クライアント名 */}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        クライアント: {conv.user_id}
                      </Typography>

                      {/* メタ情報 */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          color: 'text.secondary',
                        }}
                      >
                        <span>最終: {formatDate(conv.updated_at || conv.created_at)}</span>
                        <span>{conv.message_count}件</span>
                      </Box>
                    </Card>
                  ))
                )}
              </Box>
            </Card>
          </Grid>

          {/* 右カラム: セッション詳細 */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {selectedSession ? (
                <>
                  {/* セッション詳細ヘッダー */}
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 500, flex: 1 }}>
                        {selectedSession.title}
                      </Typography>
                      {selectedSession.crisis_flag && (
                        <Chip
                          icon={<WarningIcon />}
                          label="危機フラグ"
                          color="error"
                          size="small"
                        />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      セッションID: {selectedSession.session_id}
                    </Typography>
                  </Box>

                  {/* メッセージ一覧 */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                    {messages.map((msg) => (
                      <Box
                        key={msg.message_id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                          mb: 3,
                        }}
                      >
                        {/* メッセージバブル */}
                        <Box
                          sx={{
                            maxWidth: '75%',
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.100',
                            color: msg.role === 'user' ? 'white' : 'text.primary',
                            border: msg.crisis_detected ? '2px solid' : 'none',
                            borderColor: msg.crisis_detected ? 'error.main' : 'transparent',
                          }}
                        >
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {msg.content}
                          </Typography>

                          {/* 危機検出バッジ */}
                          {msg.crisis_detected && (
                            <Chip
                              icon={<WarningIcon sx={{ fontSize: 12 }} />}
                              label="危機キーワード検出"
                              color="error"
                              size="small"
                              sx={{ mt: 1, fontSize: '0.625rem', height: 20 }}
                            />
                          )}
                        </Box>

                        {/* タイムスタンプ */}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, px: 0.5 }}
                        >
                          {msg.timestamp || formatDate(msg.created_at)}
                        </Typography>

                        {/* 引用元情報（アシスタントメッセージのみ） */}
                        {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                          <Box sx={{ maxWidth: '75%', mt: 1 }}>
                            <Accordion>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AutoAwesomeIcon sx={{ fontSize: 14, mr: 0.5, color: 'primary.main' }} />
                                  <Typography variant="caption" sx={{ fontWeight: 500, color: 'primary.main' }}>
                                    引用元
                                  </Typography>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                {msg.citations.map((citation, idx) => (
                                  <Box key={idx} sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      - {citation.dataset_type === 'system' ? 'システムRAG' : 'ユーザーRAG'}:{' '}
                                      「{citation.source}」
                                      {citation.chunk_number && ` (チャンク ${citation.chunk_number})`}
                                      <br />
                                      {citation.similarity_score && (
                                        <span style={{ fontWeight: 500 }}>
                                          類似度: {citation.similarity_score.toFixed(2)}
                                        </span>
                                      )}
                                    </Typography>
                                  </Box>
                                ))}
                              </AccordionDetails>
                            </Accordion>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                // 空の状態（セッション未選択）
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    p: 4,
                    textAlign: 'center',
                  }}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    左側のセッション一覧からセッションを選択してください
                  </Typography>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};
