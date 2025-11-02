// ============================================
// ConversationHistoryPage - 会話履歴ページ（D-003）
// ============================================
// クライアント用、要認証、MainLayout使用

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

// Icons
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import WarningIcon from '@mui/icons-material/Warning';

// Layout & Context
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

// Types
import type { Conversation } from '@/types';

// Chat Service
import {
  getConversations,
  deleteConversation,
  groupConversationsByDate,
} from '@/services/api/chatService';

// --------------------------------------------
// アイコンマッピング（タイトルからアイコンを推測）
// --------------------------------------------

const getIconFromTitle = (title: string) => {
  if (title.includes('目標') || title.includes('設定')) {
    return <PsychologyIcon />;
  } else if (title.includes('学習') || title.includes('理論') || title.includes('コーチング')) {
    return <SchoolIcon />;
  } else if (title.includes('キャリア') || title.includes('計画')) {
    return <AssignmentIcon />;
  } else if (title.includes('モチベーション') || title.includes('サポート')) {
    return <SupportAgentIcon />;
  } else {
    return <PsychologyIcon />; // デフォルト
  }
};

// --------------------------------------------
// 時刻フォーマット
// --------------------------------------------

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const convDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // 今日の場合は時刻のみ
  if (convDate.getTime() === today.getTime()) {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  // 昨日の場合は時刻のみ
  if (convDate.getTime() === yesterday.getTime()) {
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  // 今週の場合は曜日と時刻
  const daysOfWeek = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  if (convDate.getTime() >= weekAgo.getTime()) {
    return `${daysOfWeek[date.getDay()]} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  // それ以前は日付
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// --------------------------------------------
// ConversationHistoryPage コンポーネント
// --------------------------------------------

export const ConversationHistoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State管理
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // --------------------------------------------
  // 初期化: 会話履歴を取得
  // --------------------------------------------

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const convs = await getConversations(user.user_id);
      setConversations(convs);
      setError(null);
    } catch (err) {
      console.error('会話履歴の取得に失敗:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------
  // 会話を開く（ChatPageへ遷移）
  // --------------------------------------------

  const handleViewConversation = (sessionId: string) => {
    // ChatPageに遷移し、セッションIDをクエリパラメータで渡す
    navigate(`/chat?session_id=${sessionId}`);
  };

  // --------------------------------------------
  // 削除確認モーダルを開く
  // --------------------------------------------

  const handleOpenDeleteModal = (event: React.MouseEvent, sessionId: string) => {
    event.stopPropagation(); // カードのクリックイベントを防ぐ
    setSelectedSessionId(sessionId);
    setDeleteModalOpen(true);
  };

  // --------------------------------------------
  // 削除確認モーダルを閉じる
  // --------------------------------------------

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedSessionId(null);
  };

  // --------------------------------------------
  // 会話を削除
  // --------------------------------------------

  const handleDeleteConversation = async () => {
    if (!selectedSessionId) return;

    try {
      setDeleting(true);
      await deleteConversation(selectedSessionId);
      // ローカル状態から削除
      setConversations((prev) => prev.filter((conv) => conv.session_id !== selectedSessionId));
      handleCloseDeleteModal();
    } catch (err) {
      console.error('会話削除エラー:', err);
      setError(err as Error);
    } finally {
      setDeleting(false);
    }
  };

  // --------------------------------------------
  // 会話グループ化
  // --------------------------------------------

  const groupedConversations = groupConversationsByDate(conversations);

  // --------------------------------------------
  // プレビューテキスト生成（最初のメッセージから抽出）
  // --------------------------------------------

  const getPreviewText = (conversation: Conversation): string => {
    // モックでは簡易的なプレビューを生成
    // 実際のAPIではconversation.preview_textを返す
    return `${conversation.title}についての会話です。詳細を確認してください...`;
  };

  // --------------------------------------------
  // レンダリング
  // --------------------------------------------

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* ページタイトル */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: 'primary.main' }}>
          会話履歴
        </Typography>

        {/* ローディング */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* エラー */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 3 }}>
            会話履歴の読み込みに失敗しました: {error.message}
          </Alert>
        )}

        {/* 会話リスト */}
        {!loading && !error && (
          <>
            {conversations.length === 0 ? (
              // 空の状態
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  textAlign: 'center',
                }}
              >
                <ChatBubbleOutlineIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 500, color: 'text.secondary', mb: 2 }}>
                  会話履歴がありません
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                  まだ会話を開始していません。
                  <br />
                  最初の会話を始めましょう。
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/chat')}
                  sx={{
                    borderRadius: '24px',
                    px: 4,
                    py: 1.5,
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  新しい会話を開始
                </Button>
              </Box>
            ) : (
              // 会話グループ表示
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Object.entries(groupedConversations).map(([groupName, convs]) => {
                  if (convs.length === 0) return null;
                  return (
                    <Box key={groupName}>
                      {/* グループタイトル */}
                      <Typography
                        variant="overline"
                        sx={{
                          fontWeight: 600,
                          color: 'text.secondary',
                          fontSize: 14,
                          letterSpacing: 0.5,
                          mb: 2,
                          display: 'block',
                        }}
                      >
                        {groupName}
                      </Typography>

                      {/* 会話カード */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {convs.map((conv) => (
                          <Paper
                            key={conv.session_id}
                            elevation={0}
                            onClick={() => handleViewConversation(conv.session_id)}
                            sx={{
                              p: 2,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 3,
                              '&:hover': {
                                borderColor: 'primary.main',
                                boxShadow: 2,
                                transform: 'translateY(-2px)',
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                              {/* 会話情報 */}
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                {/* タイトル */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  {getIconFromTitle(conv.title || '会話')}
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: 16,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {conv.title || '無題の会話'}
                                  </Typography>
                                </Box>

                                {/* プレビューテキスト */}
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'text.secondary',
                                    fontSize: 14,
                                    lineHeight: 1.5,
                                    mb: 1,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {getPreviewText(conv)}
                                </Typography>

                                {/* メタ情報 */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <ScheduleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12 }}>
                                      {formatTime(conv.updated_at || conv.created_at)}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12 }}>
                                      {conv.message_count || 0}メッセージ
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>

                              {/* 削除ボタン */}
                              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <IconButton
                                  onClick={(e) => handleOpenDeleteModal(e, conv.session_id)}
                                  sx={{
                                    color: 'text.secondary',
                                    transition: 'all 0.15s',
                                    '&:hover': {
                                      bgcolor: 'rgba(245, 101, 101, 0.1)',
                                      color: 'error.main',
                                    },
                                  }}
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* 削除確認モーダル */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pb: 2,
          }}
        >
          <WarningIcon sx={{ fontSize: 32, color: 'error.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            会話を削除
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
            この会話を削除してもよろしいですか？
            <br />
            削除した会話は復元できません。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDeleteModal}
            disabled={deleting}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
            }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleDeleteConversation}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
            }}
          >
            {deleting ? '削除中...' : '削除する'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ConversationHistoryPage;
