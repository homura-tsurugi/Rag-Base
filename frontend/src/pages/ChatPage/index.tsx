// ============================================
// ChatPage - AIチャットページ（D-002）
// ============================================
// クライアント向け、スマホ対応必須、独自レイアウト（MainLayout不使用）

import { useState, useEffect, useRef, useCallback } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Drawer,
  Chip,
  Stack,
  Button,
  Grid,
} from '@mui/material';

// Icons
import SendIcon from '@mui/icons-material/Send';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FlagIcon from '@mui/icons-material/Flag';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HubIcon from '@mui/icons-material/Hub';

// Context & Types
import { useAuth } from '@/contexts/AuthContext';
import type { Message, Conversation, Citation, AIMode } from '@/types';

// Chat Services
import {
  sendMessage,
  getConversations,
  getMessages,
  createConversation,
  groupConversationsByDate,
} from '@/services/api/chatService';

// --------------------------------------------
// モード定義
// --------------------------------------------

interface QuickPrompt {
  icon: React.ComponentType<{ sx?: object }>;
  title: string;
  desc: string;
  prompt: string;
}

interface ModeConfig {
  id: AIMode;
  label: string;
  icon: React.ComponentType<{ sx?: object }>;
  welcomeTitle: string;
  welcomeMessage: string;
  quickPrompts: QuickPrompt[];
}

const MODES: ModeConfig[] = [
  {
    id: 'problem-solving',
    label: '課題解決モード',
    icon: PsychologyIcon,
    welcomeTitle: '課題解決モード',
    welcomeMessage: '抱えている問題について相談してください。\n一緒に解決策を考えましょう。',
    quickPrompts: [
      {
        icon: PsychologyIcon,
        title: '問題を特定する',
        desc: '何が課題かを明確に',
        prompt: '今抱えている問題を整理したいです',
      },
      {
        icon: AnalyticsIcon,
        title: '原因を分析する',
        desc: 'なぜ起きているか',
        prompt: 'この問題の根本原因を分析してください',
      },
      {
        icon: LightbulbIcon,
        title: '解決策を考える',
        desc: 'どう解決するか',
        prompt: '解決策を一緒に考えてください',
      },
      {
        icon: AssignmentIcon,
        title: 'アクションプランを立てる',
        desc: '次に何をするか',
        prompt: '具体的なアクションプランを立てたいです',
      },
    ],
  },
  {
    id: 'learning-support',
    label: '学習支援モード',
    icon: SchoolIcon,
    welcomeTitle: '学習支援モード',
    welcomeMessage: 'COMPASS教材の学習をサポートします。\nどの部分について学びたいですか?',
    quickPrompts: [
      {
        icon: SchoolIcon,
        title: 'COMPASS教材について',
        desc: '教材の使い方を知る',
        prompt: 'COMPASS教材の効果的な学習方法を教えてください',
      },
      {
        icon: PsychologyIcon,
        title: 'コーチング理論を学ぶ',
        desc: '理論を理解する',
        prompt: 'GROWモデルなどのコーチング理論を学びたいです',
      },
      {
        icon: AutoAwesomeIcon,
        title: 'スキル向上のヒント',
        desc: '実践的なコツ',
        prompt: 'コーチングスキルを向上させるヒントをください',
      },
      {
        icon: MenuBookIcon,
        title: '学習計画を立てる',
        desc: '計画的に学ぶ',
        prompt: '効果的な学習計画を一緒に立ててください',
      },
    ],
  },
  {
    id: 'planning',
    label: '計画立案モード',
    icon: AssignmentIcon,
    welcomeTitle: '計画立案モード',
    welcomeMessage: '目標設定や計画づくりをアシストします。\nどんな目標を立てたいですか?',
    quickPrompts: [
      {
        icon: FlagIcon,
        title: '目標を設定する',
        desc: 'SMARTな目標作り',
        prompt: '今週の具体的な目標を設定したいです',
      },
      {
        icon: TimelineIcon,
        title: '週次計画を立てる',
        desc: '1週間の計画',
        prompt: '今週の計画を一緒に立ててください',
      },
      {
        icon: ListAltIcon,
        title: 'タスクを整理する',
        desc: 'やることを明確に',
        prompt: 'やるべきタスクを整理して優先順位をつけたいです',
      },
      {
        icon: PriorityHighIcon,
        title: '優先順位を決める',
        desc: '何から始めるか',
        prompt: '複数のタスクの優先順位を決めるサポートをしてください',
      },
    ],
  },
  {
    id: 'companionship',
    label: '伴走補助モード',
    icon: SupportAgentIcon,
    welcomeTitle: '伴走補助モード',
    welcomeMessage: 'あなたのログを分析して、継続的なサポートをします。\n進捗状況を確認しましょう。',
    quickPrompts: [
      {
        icon: TimelineIcon,
        title: '進捗を振り返る',
        desc: '最近の成果を確認',
        prompt: '最近の活動を振り返って進捗を確認したいです',
      },
      {
        icon: EmojiEventsIcon,
        title: 'モチベーションを上げる',
        desc: 'やる気を引き出す',
        prompt: 'モチベーションが下がっているので上げるアドバイスをください',
      },
      {
        icon: CheckCircleIcon,
        title: '成果を確認する',
        desc: '達成したことを見る',
        prompt: 'これまでの成果を一緒に確認してください',
      },
      {
        icon: TrendingUpIcon,
        title: '次のステップを考える',
        desc: 'これから何をするか',
        prompt: '次に取り組むべきことを一緒に考えてください',
      },
    ],
  },
];

// --------------------------------------------
// ボトムナビゲーション定義
// --------------------------------------------

interface NavItem {
  label: string;
  icon: React.ComponentType<{ sx?: object }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'ホーム', icon: HomeIcon },
  { label: '計画/実行', icon: AssignmentIcon },
  { label: '確認/改善', icon: AnalyticsIcon },
  { label: '学習', icon: SchoolIcon },
  { label: 'ログ', icon: HistoryIcon },
];

// --------------------------------------------
// ChatPage コンポーネント
// --------------------------------------------

export const ChatPage = () => {
  const { user } = useAuth();

  // State管理
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<AIMode>('problem-solving');
  const [activeNav, setActiveNav] = useState('学習');

  // Refs
  const chatHistoryRef = useRef<HTMLDivElement>(null);

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
      const convs = await getConversations(user.user_id);
      setConversations(convs);
    } catch (error) {
      console.error('会話履歴の取得に失敗:', error);
    }
  };

  // --------------------------------------------
  // 自動スクロール（新メッセージ追加時）
  // --------------------------------------------

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  // --------------------------------------------
  // メッセージ送信
  // --------------------------------------------

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping || !user) return;

    const messageContent = inputValue.trim();
    setInputValue('');

    // ユーザーメッセージを即座に表示
    const userMessage: Message = {
      message_id: `temp-${Date.now()}`,
      session_id: currentSessionId || '',
      role: 'user',
      content: messageContent,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // タイピングインジケーター表示
    setIsTyping(true);

    try {
      const response = await sendMessage({
        session_id: currentSessionId || undefined,
        content: messageContent,
        user_id: user.user_id,
      });

      // セッションIDを更新（新規会話の場合）
      if (!currentSessionId) {
        setCurrentSessionId(response.session_id);
        await loadConversations();
      }

      // AI応答を表示
      setMessages((prev) => [...prev, response.message]);
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      const errorMessage: Message = {
        message_id: `error-${Date.now()}`,
        session_id: currentSessionId || '',
        role: 'assistant',
        content: '申し訳ございません。エラーが発生しました。もう一度お試しください。',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, user, currentSessionId]);

  // --------------------------------------------
  // Enterキーで送信
  // --------------------------------------------

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --------------------------------------------
  // クイックプロンプト使用
  // --------------------------------------------

  const handleQuickPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  // --------------------------------------------
  // 新しい会話を開始
  // --------------------------------------------

  const handleNewConversation = async () => {
    if (!user) return;

    if (messages.length > 0) {
      const confirmed = window.confirm('新しい会話を開始しますか？現在の会話は保存されます。');
      if (!confirmed) return;
    }

    try {
      const newConv = await createConversation(user.user_id);
      setCurrentSessionId(newConv.session_id);
      setMessages([]);
      await loadConversations();
    } catch (error) {
      console.error('新規会話作成エラー:', error);
    }
  };

  // --------------------------------------------
  // 会話履歴から読み込み
  // --------------------------------------------

  const handleLoadConversation = async (sessionId: string) => {
    try {
      const msgs = await getMessages(sessionId);
      setMessages(msgs);
      setCurrentSessionId(sessionId);
      setSidebarOpen(false);
    } catch (error) {
      console.error('会話読み込みエラー:', error);
    }
  };

  // --------------------------------------------
  // 会話グループ化
  // --------------------------------------------

  const groupedConversations = groupConversationsByDate(conversations);

  // --------------------------------------------
  // 現在のモード設定を取得
  // --------------------------------------------

  const currentModeConfig = MODES.find((m) => m.id === currentMode) || MODES[0];

  // --------------------------------------------
  // 時刻フォーマット
  // --------------------------------------------

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // --------------------------------------------
  // レンダリング
  // --------------------------------------------

  return (
    <Box
      sx={{
        height: '100vh',
        maxWidth: '600px',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* ヘッダー */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          px: 2,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 1,
          zIndex: 100,
        }}
      >
        {/* ロゴ */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HubIcon sx={{ fontSize: 24, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 20, color: 'primary.main' }}>
              COM:PASS
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', pl: '28px' }}>
            RAGベースAIコーチング
          </Typography>
        </Box>

        {/* ヘッダーアクション */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            onClick={handleNewConversation}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <HistoryIcon />
          </IconButton>
        </Box>
      </Box>

      {/* モードセレクター */}
      <Box
        sx={{
          position: 'sticky',
          top: 61,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          p: 2,
          overflowX: 'auto',
          zIndex: 90,
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            minWidth: 'min-content',
          }}
        >
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                variant={currentMode === mode.id ? 'contained' : 'outlined'}
                startIcon={<Icon />}
                sx={{
                  borderRadius: '24px',
                  fontSize: 14,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                }}
              >
                {mode.label}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* チャット履歴エリア */}
      <Box
        ref={chatHistoryRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'background.default',
          p: 2,
          pb: '150px', // 入力エリア + ボトムナビ分のスペース
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'grey.200',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.400',
            borderRadius: '3px',
          },
        }}
      >
        {messages.length === 0 ? (
          // ウェルカムメッセージ + クイックプロンプト
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {(() => {
              const Icon = currentModeConfig.icon;
              return <Icon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />;
            })()}
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 24, mb: 1 }}>
              {currentModeConfig.welcomeTitle}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', fontSize: 16, mb: 4, whiteSpace: 'pre-line' }}
            >
              {currentModeConfig.welcomeMessage}
            </Typography>

            {/* クイックプロンプト（2×2グリッド） */}
            <Grid container spacing={2} sx={{ maxWidth: 600, mx: 'auto' }}>
              {currentModeConfig.quickPrompts.map((qp, index) => {
                const Icon = qp.icon;
                return (
                  <Grid size={{ xs: 6 }} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        minHeight: 120,
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: 1,
                        },
                      }}
                      onClick={() => handleQuickPrompt(qp.prompt)}
                    >
                      <Icon sx={{ color: 'primary.main', fontSize: 32, mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 14, mb: 0.5 }}>
                        {qp.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12 }}>
                        {qp.desc}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ) : (
          // メッセージバブル一覧
          <>
            {messages.map((message) => (
              <Box
                key={message.message_id}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.3s',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Box sx={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Paper
                    elevation={message.role === 'user' ? 0 : 1}
                    sx={{
                      p: '12px 16px',
                      bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                      borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      wordWrap: 'break-word',
                    }}
                  >
                    <Typography
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontSize: 15,
                        lineHeight: 1.5,
                      }}
                    >
                      {message.content}
                    </Typography>

                    {/* 引用元情報 */}
                    {message.citations && message.citations.length > 0 && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 1,
                          bgcolor: 'grey.100',
                          borderLeft: '3px solid',
                          borderColor: 'primary.main',
                          borderRadius: '4px',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <AutoAwesomeIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 500, color: 'primary.main', fontSize: 12 }}
                          >
                            引用元
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {message.citations.map((citation: Citation, idx: number) => (
                            <Chip
                              key={idx}
                              icon={
                                citation.dataset_type === 'system' ? (
                                  <BookIcon sx={{ fontSize: 12 }} />
                                ) : (
                                  <PersonIcon sx={{ fontSize: 12 }} />
                                )
                              }
                              label={citation.source}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: 10,
                                bgcolor: 'rgba(44, 82, 130, 0.1)',
                                color: 'primary.main',
                                '& .MuiChip-icon': {
                                  fontSize: 12,
                                  color: 'primary.main',
                                },
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Paper>

                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: 12,
                      px: 0.5,
                      alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {formatTime(message.created_at)}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* タイピングインジケーター */}
            {isTyping && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: '16px 16px 16px 4px',
                    bgcolor: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: 'primary.main',
                          borderRadius: '50%',
                          animation: 'typing 1.4s infinite ease-in-out',
                          animationDelay: `${i * 0.2}s`,
                          '@keyframes typing': {
                            '0%, 60%, 100%': {
                              transform: 'translateY(0)',
                              opacity: 0.7,
                            },
                            '30%': {
                              transform: 'translateY(-8px)',
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 14 }}>
                    AIが入力中...
                  </Typography>
                </Paper>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* 入力エリア（固定） */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 70,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
          zIndex: 50,
        }}
      >
        <TextField
          fullWidth
          placeholder="メッセージを入力..."
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              fontSize: 15,
            },
            '& .MuiInputBase-input': {
              py: '12px',
              px: 2,
            },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isTyping}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            width: 48,
            height: 48,
            flexShrink: 0,
            '&:hover': {
              bgcolor: 'primary.light',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            },
          }}
        >
          <SendIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      {/* ボトムナビゲーション（固定） */}
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'space-around',
          py: 1,
          zIndex: 100,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.label;
          return (
            <Box
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.5,
                color: isActive ? 'primary.main' : 'text.secondary',
                cursor: 'pointer',
                transition: 'color 0.15s',
                minWidth: 60,
                '&:hover': {
                  color: 'primary.light',
                },
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
              <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 500 }}>
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* 会話履歴Drawer */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 320 },
            maxWidth: 320,
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Drawerヘッダー */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 500, fontSize: 18 }}>
              会話履歴
            </Typography>
            <IconButton onClick={() => setSidebarOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 会話リスト */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            {Object.entries(groupedConversations).map(([groupName, convs]) => {
              if (convs.length === 0) return null;
              return (
                <Box key={groupName} sx={{ mb: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      color: 'text.secondary',
                      fontSize: 12,
                      px: 1,
                      mb: 1,
                      display: 'block',
                    }}
                  >
                    {groupName}
                  </Typography>
                  {convs.map((conv) => (
                    <Box
                      key={conv.session_id}
                      onClick={() => handleLoadConversation(conv.session_id)}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        cursor: 'pointer',
                        borderRadius: 2,
                        bgcolor:
                          conv.session_id === currentSessionId ? 'rgba(44, 82, 130, 0.1)' : 'transparent',
                        borderLeft: conv.session_id === currentSessionId ? '3px solid' : 'none',
                        borderColor: conv.session_id === currentSessionId ? 'primary.main' : 'transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'grey.100',
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontSize: 14,
                          mb: 0.25,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {conv.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12 }}>
                        {formatTime(conv.updated_at || conv.created_at)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ChatPage;
