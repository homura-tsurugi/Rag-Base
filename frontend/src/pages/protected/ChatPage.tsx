// ============================================
// ChatPage - AIチャットページ（D-002）
// ============================================
// Mental-Base AIAssistant.htmlデザイン準拠
// 全画面レイアウト、max-width: 600px中央配置

import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import type { ChangeEvent } from 'react';
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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import HubIcon from '@mui/icons-material/Hub';
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FlagIcon from '@mui/icons-material/Flag';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import { useAuth } from '@/contexts/AuthContext';
import type { Message, Conversation, Citation, AIMode } from '@/types';
import {
  mockSendMessage,
  mockGetConversations,
  mockGetMessages,
  mockCreateConversation,
  groupConversationsByDate,
} from '@/services/api/mockChatService';

// --------------------------------------------
// モード定義
// --------------------------------------------

interface QuickStart {
  icon: typeof LightbulbIcon;
  label: string;
  prompt: string;
}

interface ModeConfig {
  id: AIMode;
  label: string;
  icon: typeof PsychologyIcon;
  welcomeTitle: string;
  welcomeMessage: string;
  quickStarts: QuickStart[];
}

const MODES: ModeConfig[] = [
  {
    id: 'problem-solving',
    label: '課題解決モード',
    icon: PsychologyIcon,
    welcomeTitle: '課題解決モード',
    welcomeMessage: '抱えている問題について相談してください。\n一緒に解決策を考えましょう。',
    quickStarts: [
      { icon: LightbulbIcon, label: '障害を整理したい', prompt: '目標達成の障害を整理して、解決策を考えたいです' },
      { icon: PriorityHighIcon, label: '優先順位の付け方', prompt: 'タスクの優先順位の付け方を教えてください' },
      { icon: AccessTimeIcon, label: '時間管理の悩み', prompt: '時間管理がうまくいかず困っています' },
      { icon: BatteryChargingFullIcon, label: 'モチベーション維持', prompt: 'モチベーションが続かないのですが、どうすればいいですか？' },
    ],
  },
  {
    id: 'learning-support',
    label: '学習支援モード',
    icon: SchoolIcon,
    welcomeTitle: '学習支援モード',
    welcomeMessage: 'COMPASS教材の学習をサポートします。\nどの部分について学びたいですか？',
    quickStarts: [
      { icon: MenuBookIcon, label: 'PDCAサイクル', prompt: 'PDCAサイクルについて詳しく教えてください' },
      { icon: FlagIcon, label: '目標設定の方法', prompt: '効果的な目標設定の方法を学びたいです' },
      { icon: AutoAwesomeIcon, label: '振り返りのコツ', prompt: '振り返りを効果的に行うコツを教えてください' },
      { icon: SupportAgentIcon, label: 'コーチングの基本', prompt: 'コーチングの基本について学びたいです' },
    ],
  },
  {
    id: 'planning',
    label: '計画立案モード',
    icon: AssignmentIcon,
    welcomeTitle: '計画立案モード',
    welcomeMessage: '目標設定や計画づくりをアシストします。\nどんな目標を立てたいですか？',
    quickStarts: [
      { icon: FlagIcon, label: '今週の目標', prompt: '今週の目標を立てるサポートをお願いします' },
      { icon: TrendingUpIcon, label: '長期目標を設定', prompt: '長期的な目標を設定したいです' },
      { icon: ListAltIcon, label: 'アクションプラン', prompt: '具体的なアクションプランを作成したいです' },
      { icon: TimelineIcon, label: 'マイルストーン', prompt: '目標達成のマイルストーンを決めたいです' },
    ],
  },
  {
    id: 'companionship',
    label: '伴走補助モード',
    icon: SupportAgentIcon,
    welcomeTitle: '伴走補助モード',
    welcomeMessage: 'あなたのログを分析して、継続的なサポートをします。\n進捗状況を確認しましょう。',
    quickStarts: [
      { icon: CheckCircleIcon, label: '進捗を確認', prompt: '最近の進捗状況を確認したいです' },
      { icon: AutoAwesomeIcon, label: '振り返りをする', prompt: '最近の活動を振り返りたいです' },
      { icon: BatteryChargingFullIcon, label: '継続のコツ', prompt: '習慣を継続するコツを教えてください' },
      { icon: EmojiEventsIcon, label: '達成感を共有', prompt: '最近達成したことを共有して、次のステップを考えたいです' },
    ],
  },
];

// --------------------------------------------
// ボトムナビゲーション定義
// --------------------------------------------

interface NavItem {
  label: string;
  icon: typeof HomeIcon;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
      const convs = await mockGetConversations(user.user_id);
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
      const response = await mockSendMessage({
        session_id: currentSessionId || undefined,
        content: messageContent,
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
  // クイックスタート使用
  // --------------------------------------------

  const handleQuickStart = (prompt: string) => {
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
      const newConv = await mockCreateConversation(user.user_id);
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
      const msgs = await mockGetMessages(sessionId);
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
  // モード変更ハンドラー
  // --------------------------------------------

  const handleModeChange = (mode: AIMode) => {
    setCurrentMode(mode);
    console.log('Selected mode:', mode);
  };

  // --------------------------------------------
  // ボトムナビゲーションハンドラー
  // --------------------------------------------

  const handleNavClick = (label: string) => {
    setActiveNav(label);
    console.log('Navigation clicked:', label);
  };

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
        maxWidth: '600px',
        height: '100vh',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
      }}
    >
      {/* ヘッダー（sticky top） */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          bgcolor: 'white',
          borderBottom: '1px solid',
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
        {/* 左側: ロゴ + サブタイトル */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HubIcon sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 20 }}>
              COM:PASS
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12, pl: 3.5 }}>
            RAGベースAIコーチング
          </Typography>
        </Box>

        {/* 右側: 新規会話 + 会話履歴ボタン */}
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

      {/* モードセレクター（sticky、ヘッダー直下） */}
      <Box
        sx={{
          position: 'sticky',
          top: '61px',
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 2,
          py: 2,
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
                onClick={() => handleModeChange(mode.id)}
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
                  ...(currentMode === mode.id
                    ? {
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        },
                      }
                    : {
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          bgcolor: 'grey.50',
                        },
                      }),
                }}
              >
                {mode.label}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* チャット履歴エリア（flex: 1、overflow-y: auto） */}
      <Box
        ref={chatHistoryRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          bgcolor: 'grey.50',
          pb: '150px',
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
            <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 16, mb: 4 }}>
              {currentModeConfig.welcomeMessage.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < currentModeConfig.welcomeMessage.split('\n').length - 1 && <br />}
                </span>
              ))}
            </Typography>

            {/* クイックスタートボタン（4つ） */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr' },
                gap: 2,
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              {currentModeConfig.quickStarts.map((qs, index) => {
                const Icon = qs.icon;
                return (
                  <Paper
                    key={index}
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
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: 1,
                      },
                    }}
                    onClick={() => handleQuickStart(qs.prompt)}
                  >
                    <Icon sx={{ color: 'primary.main', fontSize: 28, mb: 0.5 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 13 }}>
                      {qs.label}
                    </Typography>
                  </Paper>
                );
              })}
            </Box>
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
                      fontSize: 15,
                      lineHeight: 1.5,
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
                          <BookIcon sx={{ fontSize: 14, color: 'primary.main' }} />
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

            {/* 自動スクロール用の参照 */}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* 入力エリア（fixed bottom、ボトムナビゲーションの上） */}
      <Box
        sx={{
          position: 'fixed',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '600px',
          bgcolor: 'white',
          p: 2,
          borderTop: '1px solid',
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
              '& fieldset': {
                borderColor: 'divider',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
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
            '&:active': {
              transform: 'scale(0.95)',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            },
            transition: 'all 0.15s',
          }}
        >
          <SendIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      {/* 会話履歴Drawer（右側） */}
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
                          conv.session_id === currentSessionId
                            ? 'rgba(44, 82, 130, 0.1)'
                            : 'transparent',
                        borderLeft: conv.session_id === currentSessionId ? '3px solid' : 'none',
                        borderColor: conv.session_id === currentSessionId ? 'primary.main' : 'transparent',
                        transition: 'all 0.2s',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        '&:hover': {
                          bgcolor: 'grey.100',
                        },
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
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
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: 12,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'block',
                          }}
                        >
                          {conv.title}...
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 12, ml: 1 }}>
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

      {/* ボトムナビゲーション（fixed bottom） */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '600px',
          bgcolor: 'white',
          borderTop: '1px solid',
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
              onClick={() => handleNavClick(item.label)}
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
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
