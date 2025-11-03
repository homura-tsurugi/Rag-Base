// ============================================
// AdminDashboardPage - メンター向け管理ダッシュボード
// ============================================
// モックアップ (AdminDashboardPage.html) に準拠したデザイン

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Tune as TuneIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
  Forum as ForumIcon,
  ChatBubble as ChatBubbleIcon,
  Api as ApiIcon,
  Hub as HubIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 240;

interface StatCardProps {
  icon: React.ReactElement;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string;
  unit: string;
  footer: string;
}

const StatCard = ({ icon, iconColor, iconBgColor, label, value, unit, footer }: StatCardProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        transition: 'all 0.15s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: iconBgColor,
              color: iconColor,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="h3" component="span" fontWeight={700}>
                {value}
              </Typography>
              <Typography
                variant="h6"
                component="span"
                color="text.secondary"
                sx={{ ml: 1 }}
              >
                {unit}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {footer}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

interface NavCardProps {
  icon: React.ReactElement;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  badge: string;
  href: string;
  onClick?: () => void;
}

const NavCard = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  description,
  badge,
  onClick,
}: NavCardProps) => {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        border: '2px solid transparent',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: theme.palette.primary.light,
          '& .nav-arrow': {
            transform: 'translateX(4px)',
          },
        },
      }}
    >
      <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: iconBgColor,
            color: iconColor,
            mb: 1,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={500} sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {description}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" color="primary" fontWeight={500}>
              管理画面へ
            </Typography>
            <ArrowForwardIcon
              className="nav-arrow"
              sx={{
                fontSize: 18,
                color: 'primary.main',
                transition: 'transform 0.15s ease-in-out',
              }}
            />
          </Box>
          <Box
            sx={{
              bgcolor: alpha(theme.palette.text.primary, 0.06),
              color: 'text.secondary',
              px: 1,
              py: 0.5,
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {badge}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const AdminDashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const handleLogout = () => {
    // ログアウト処理
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // モックデータ: ユーザー一覧
  const mockUsers = [
    { id: 'user1', name: 'クライアント1', email: 'client1@rag-base.local', activeConversations: 5, totalMessages: 47 },
    { id: 'user2', name: 'クライアント2', email: 'client2@rag-base.local', activeConversations: 3, totalMessages: 28 },
    { id: 'user3', name: 'クライアント3', email: 'client3@rag-base.local', activeConversations: 8, totalMessages: 92 },
  ];

  // モックデータ: 会話履歴（選択されたユーザーの）
  const mockConversations = selectedUserId ? [
    {
      id: 'session1',
      title: '目標設定についての相談',
      date: '2025-11-01',
      messageCount: 12,
      hasSummary: true,
      summary: {
        topics: ['キャリア目標', '3ヶ月計画', 'スキルアップ'],
        problems: ['時間管理の課題', 'モチベーション維持'],
        advice: ['毎日30分の学習時間を確保', '週次で進捗確認'],
        insights: ['短期目標の細分化が重要', '小さな成功体験の積み重ね'],
        next_steps: ['学習計画の作成', '1週間後のフォローアップ'],
      },
    },
    {
      id: 'session2',
      title: '進捗確認とフィードバック',
      date: '2025-11-02',
      messageCount: 8,
      hasSummary: true,
      summary: {
        topics: ['進捗確認', '課題の振り返り'],
        problems: ['計画通りに進まない', '予想外の障害'],
        advice: ['柔軟に計画を調整', '小さく始める'],
        insights: ['完璧を目指さない', '継続が力になる'],
        next_steps: ['計画の見直し', '明日から実行'],
      },
    },
    {
      id: 'session3',
      title: '学習方法の相談',
      date: '2025-11-03',
      messageCount: 15,
      hasSummary: false,
    },
  ] : [];

  const menuItems = [
    { id: 'dashboard', label: 'AIチャットダッシュボード', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
    { id: 'rag', label: 'RAG管理', icon: <FolderIcon sx={{ fontSize: 20 }} /> },
    { id: 'users', label: 'ユーザー管理', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
  ];

  // RAG管理のカード（Dify管理ページへのショートカット）
  const ragManagementCards = [
    {
      id: 'knowledge',
      title: 'ナレッジベース',
      icon: <FolderIcon sx={{ fontSize: 28 }} />,
      iconBgColor: alpha(theme.palette.primary.main, 0.1),
      iconColor: theme.palette.primary.main,
      description: 'システムRAG（専門知識）とユーザーRAG（個別データ）のアップロード・更新・削除を管理します。',
      badge: 'Dify',
      href: 'https://cloud.dify.ai/datasets',
    },
    {
      id: 'prompts',
      title: 'プロンプト編集',
      icon: <TuneIcon sx={{ fontSize: 28 }} />,
      iconBgColor: alpha(theme.palette.info.main, 0.1),
      iconColor: theme.palette.info.main,
      description: 'AIの応答スタイル、ペルソナ、指示を調整し、A/Bテストやプレビューを実行できます。',
      badge: 'Dify',
      href: 'https://cloud.dify.ai/app/9cea88a7-7aee-44ae-9635-5441faed3df2/configuration',
    },
    {
      id: 'api',
      title: 'API管理',
      icon: <ApiIcon sx={{ fontSize: 28 }} />,
      iconBgColor: alpha(theme.palette.success.main, 0.1),
      iconColor: theme.palette.success.main,
      description: 'API設定、アクセスキーの発行・管理、レート制限の設定を行います。',
      badge: 'Dify',
      href: 'https://cloud.dify.ai/app/9cea88a7-7aee-44ae-9635-5441faed3df2/develop',
    },
    {
      id: 'logs',
      title: 'ログ',
      icon: <HistoryIcon sx={{ fontSize: 28 }} />,
      iconBgColor: alpha(theme.palette.warning.main, 0.1),
      iconColor: theme.palette.warning.main,
      description: '全クライアントの会話ログ、エラーログ、API呼び出し履歴を確認できます。',
      badge: 'Dify',
      href: 'https://cloud.dify.ai/app/9cea88a7-7aee-44ae-9635-5441faed3df2/logs',
    },
    {
      id: 'analytics',
      title: '統計',
      icon: <DashboardIcon sx={{ fontSize: 28 }} />,
      iconBgColor: alpha(theme.palette.secondary.main, 0.1),
      iconColor: theme.palette.secondary.main,
      description: '利用統計、トークン消費量、ユーザーアクティビティの分析データを表示します。',
      badge: 'Dify',
      href: 'https://cloud.dify.ai/app/9cea88a7-7aee-44ae-9635-5441faed3df2/overview',
    },
  ];

  const otherItems = [
    { id: 'settings', label: '設定', icon: <SettingsIcon sx={{ fontSize: 20 }} /> },
    { id: 'logout', label: 'ログアウト', icon: <LogoutIcon sx={{ fontSize: 20 }} /> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Side Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: theme.palette.primary.dark,
            color: 'white',
            borderRight: 'none',
          },
        }}
      >
        {/* Logo & User Info */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
            <HubIcon sx={{ fontSize: 24, color: 'white' }} />
            <Typography variant="h6" fontWeight={700} color="white">
              COM:PASS
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 2,
              borderRadius: 1,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <Avatar sx={{ width: 40, height: 40, bgcolor: '#4299e1' }}>
              C
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={500} color="white">
                コーチ
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, color: 'white' }}>
                管理者
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
          {/* 管理セクション */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                opacity: 0.6,
                color: 'white',
                px: 1,
                mb: 0.5,
                display: 'block',
                fontSize: '12px',
              }}
            >
              管理
            </Typography>
            <List disablePadding>
              {menuItems.map((item) => (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={currentPage === item.id}
                    onClick={() => setCurrentPage(item.id)}
                    sx={{
                      borderRadius: 1,
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      py: 1,
                      px: 2,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                          color: 'white',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'white',
                        },
                        '& .MuiListItemText-primary': {
                          color: 'white',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: '14px', color: 'inherit' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* その他セクション */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                opacity: 0.6,
                color: 'white',
                px: 1,
                mb: 0.5,
                display: 'block',
                fontSize: '12px',
              }}
            >
              その他
            </Typography>
            <List disablePadding>
              {otherItems.map((item) => (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      if (item.id === 'logout') {
                        handleLogout();
                      } else if (item.id === 'settings') {
                        setCurrentPage('settings');
                      }
                    }}
                    sx={{
                      borderRadius: 1,
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      py: 1,
                      px: 2,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        '& .MuiListItemIcon-root': {
                          color: 'white',
                        },
                        '& .MuiListItemText-primary': {
                          color: 'white',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: '14px', color: 'inherit' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          bgcolor: '#f5f7fa',
          minHeight: '100vh',
        }}
      >
        {/* Content Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Box>
            <Typography variant="h4" fontWeight={500} color="text.primary">
              {currentPage === 'dashboard' && 'AIチャットダッシュボード'}
              {currentPage === 'rag' && 'RAG管理'}
              {currentPage === 'users' && 'ユーザー管理'}
              {currentPage === 'settings' && '設定'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {currentPage === 'dashboard' && 'システム全体の統計と利用状況を確認できます'}
              {currentPage === 'rag' && 'Dify管理機能へのショートカット'}
              {currentPage === 'users' && 'ユーザー情報とRAGデータの管理'}
              {currentPage === 'settings' && 'システム設定'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              sx={{
                bgcolor: 'transparent',
                color: 'text.secondary',
                '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.05) },
              }}
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton
              sx={{
                bgcolor: 'transparent',
                color: 'text.secondary',
                '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.05) },
              }}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Dashboard Page */}
        {currentPage === 'dashboard' && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 3,
            }}
          >
            <StatCard
              icon={<PeopleIcon sx={{ fontSize: 24 }} />}
              iconColor={theme.palette.primary.main}
              iconBgColor={alpha(theme.palette.primary.main, 0.1)}
              label="総ユーザー数"
              value="12"
              unit="人"
              footer="アクティブユーザー: 10人"
            />
            <StatCard
              icon={<ForumIcon sx={{ fontSize: 24 }} />}
              iconColor={theme.palette.success.main}
              iconBgColor={alpha(theme.palette.success.main, 0.1)}
              label="総会話数"
              value="347"
              unit="件"
              footer="今週の新規会話: 28件"
            />
            <StatCard
              icon={<ChatBubbleIcon sx={{ fontSize: 24 }} />}
              iconColor={theme.palette.info.main}
              iconBgColor={alpha(theme.palette.info.main, 0.1)}
              label="総メッセージ数"
              value="1,542"
              unit="件"
              footer="平均: 4.4メッセージ/会話"
            />
            <StatCard
              icon={<ApiIcon sx={{ fontSize: 24 }} />}
              iconColor={theme.palette.warning.main}
              iconBgColor={alpha(theme.palette.warning.main, 0.1)}
              label="Claude API使用量"
              value="245K"
              unit="トークン"
              footer="今月の推定コスト: $8.50"
            />
          </Box>
        )}

        {/* RAG Management Page */}
        {currentPage === 'rag' && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 3,
            }}
          >
            {ragManagementCards.map((card) => (
              <NavCard
                key={card.id}
                icon={card.icon}
                iconBgColor={card.iconBgColor}
                iconColor={card.iconColor}
                title={card.title}
                description={card.description}
                badge={card.badge}
                href={card.href}
                onClick={() => window.open(card.href, '_blank')}
              />
            ))}
          </Box>
        )}

        {/* Users Management Page */}
        {currentPage === 'users' && (
          <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 180px)' }}>
            {/* ユーザー一覧 */}
            <Card sx={{ width: '320px', flexShrink: 0, overflowY: 'auto' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  クライアント一覧
                </Typography>
                <List disablePadding>
                  {mockUsers.map((user) => (
                    <ListItem
                      key={user.id}
                      disablePadding
                      sx={{ mb: 1 }}
                    >
                      <ListItemButton
                        selected={selectedUserId === user.id}
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setSelectedSessionId(null);
                        }}
                        sx={{
                          borderRadius: 1,
                          '&.Mui-selected': {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.15),
                            },
                          },
                        }}
                      >
                        <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                          {user.name.charAt(user.name.length - 1)}
                        </Avatar>
                        <ListItemText
                          primary={user.name}
                          secondary={
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Chip
                                label={`${user.activeConversations}会話`}
                                size="small"
                                sx={{ height: 20, fontSize: 11 }}
                              />
                              <Chip
                                label={`${user.totalMessages}メッセージ`}
                                size="small"
                                sx={{ height: 20, fontSize: 11 }}
                              />
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* 会話履歴 */}
            {selectedUserId ? (
              <Card sx={{ flex: 1, overflowY: 'auto' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      会話履歴
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mockConversations.length}件
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>会話タイトル</TableCell>
                          <TableCell>日付</TableCell>
                          <TableCell align="center">メッセージ数</TableCell>
                          <TableCell align="center">要約</TableCell>
                          <TableCell align="center">アクション</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockConversations.map((conversation) => (
                          <TableRow key={conversation.id} hover>
                            <TableCell>{conversation.title}</TableCell>
                            <TableCell>{conversation.date}</TableCell>
                            <TableCell align="center">{conversation.messageCount}</TableCell>
                            <TableCell align="center">
                              {conversation.hasSummary ? (
                                <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                              ) : (
                                <WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {conversation.hasSummary && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => setSelectedSessionId(conversation.id)}
                                >
                                  要約を見る
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.common.black, 0.02),
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  クライアントを選択してください
                </Typography>
              </Box>
            )}

            {/* 要約モーダル */}
            <Dialog
              open={!!selectedSessionId}
              onClose={() => setSelectedSessionId(null)}
              maxWidth="md"
              fullWidth
            >
              {selectedSessionId && (() => {
                const conversation = mockConversations.find(c => c.id === selectedSessionId);
                if (!conversation || !conversation.summary) return null;

                return (
                  <>
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          会話要約
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {conversation.title} - {conversation.date}
                        </Typography>
                      </Box>
                      <IconButton onClick={() => setSelectedSessionId(null)}>
                        <CloseIcon />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* 話題 */}
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                            💬 話題
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {conversation.summary.topics.map((topic, idx) => (
                              <Chip key={idx} label={topic} size="small" />
                            ))}
                          </Box>
                        </Box>

                        <Divider />

                        {/* 問題 */}
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                            ⚠️ 問題・課題
                          </Typography>
                          <List dense>
                            {conversation.summary.problems.map((problem, idx) => (
                              <ListItem key={idx} disablePadding>
                                <ListItemText primary={`• ${problem}`} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        <Divider />

                        {/* アドバイス */}
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                            💡 提供されたアドバイス
                          </Typography>
                          <List dense>
                            {conversation.summary.advice.map((adv, idx) => (
                              <ListItem key={idx} disablePadding>
                                <ListItemText primary={`• ${adv}`} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        <Divider />

                        {/* 気づき */}
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                            ✨ 気づき
                          </Typography>
                          <List dense>
                            {conversation.summary.insights.map((insight, idx) => (
                              <ListItem key={idx} disablePadding>
                                <ListItemText primary={`• ${insight}`} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>

                        <Divider />

                        {/* 次のステップ */}
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                            📌 次のステップ
                          </Typography>
                          <List dense>
                            {conversation.summary.next_steps.map((step, idx) => (
                              <ListItem key={idx} disablePadding>
                                <ListItemText primary={`• ${step}`} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setSelectedSessionId(null)}>閉じる</Button>
                    </DialogActions>
                  </>
                );
              })()}
            </Dialog>
          </Box>
        )}

        {/* Settings Page */}
        {currentPage === 'settings' && (
          <Box>
            <Typography variant="body1" color="text.secondary">
              設定機能は現在開発中です。
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
