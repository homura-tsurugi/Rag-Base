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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  Tune as TuneIcon,
  Chat as ChatIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
  Forum as ForumIcon,
  ChatBubble as ChatBubbleIcon,
  Api as ApiIcon,
  Hub as HubIcon,
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
  const [currentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: <DashboardIcon sx={{ fontSize: 20 }} />, href: '/admin' },
    { id: 'datasets', label: 'ナレッジベース', icon: <FolderIcon sx={{ fontSize: 20 }} />, href: '/admin/datasets' },
    { id: 'logs', label: '会話履歴', icon: <HistoryIcon sx={{ fontSize: 20 }} />, href: '/admin/logs' },
    { id: 'users', label: 'ユーザー管理', icon: <PeopleIcon sx={{ fontSize: 20 }} />, href: '/admin/users' },
  ];

  const settingsItems = [
    { id: 'prompts', label: 'プロンプト編集', icon: <TuneIcon sx={{ fontSize: 20 }} />, href: '/admin/app/config' },
  ];

  const otherItems = [
    { id: 'chat', label: 'チャット画面', icon: <ChatIcon sx={{ fontSize: 20 }} />, href: '/chat' },
    { id: 'logout', label: 'ログアウト', icon: <LogoutIcon sx={{ fontSize: 20 }} />, href: '/logout' },
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
                    onClick={() => navigate(item.href)}
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

          {/* 設定セクション */}
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
              設定
            </Typography>
            <List disablePadding>
              {settingsItems.map((item) => (
                <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.href)}
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
                    onClick={() => navigate(item.href)}
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
              管理ダッシュボード
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

        {/* System Stats Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 3,
            mb: 6,
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

        {/* Navigation Cards Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={500} sx={{ mb: 0.5 }}>
            管理機能
          </Typography>
          <Typography variant="body2" color="text.secondary">
            各管理機能にアクセスできます
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 3,
          }}
        >
          <NavCard
            icon={<FolderIcon sx={{ fontSize: 28 }} />}
            iconBgColor={alpha(theme.palette.primary.main, 0.1)}
            iconColor={theme.palette.primary.main}
            title="ナレッジベース管理"
            description="システムRAG（専門知識）とユーザーRAG（個別データ）のアップロード・更新・削除を管理します。"
            badge="D-005"
            href="/admin/datasets"
            onClick={() => navigate('/admin/datasets')}
          />
          <NavCard
            icon={<HistoryIcon sx={{ fontSize: 28 }} />}
            iconBgColor={alpha(theme.palette.warning.main, 0.1)}
            iconColor={theme.palette.warning.main}
            title="会話履歴管理"
            description="全クライアントの会話履歴を確認し、危機フラグや引用元情報をチェックできます。"
            badge="D-006"
            href="/admin/logs"
            onClick={() => navigate('/admin/logs')}
          />
          <NavCard
            icon={<TuneIcon sx={{ fontSize: 28 }} />}
            iconBgColor={alpha(theme.palette.info.main, 0.1)}
            iconColor={theme.palette.info.main}
            title="プロンプト編集"
            description="AIの応答スタイル、ペルソナ、指示を調整し、A/Bテストやプレビューを実行できます。"
            badge="D-007"
            href="/admin/app/config"
            onClick={() => navigate('/admin/app/config')}
          />
          <NavCard
            icon={<PeopleIcon sx={{ fontSize: 28 }} />}
            iconBgColor={alpha(theme.palette.success.main, 0.1)}
            iconColor={theme.palette.success.main}
            title="ユーザー管理"
            description="クライアントの追加・削除・情報編集、アクセストークンの発行を管理できます。"
            badge="D-009"
            href="/admin/users"
            onClick={() => navigate('/admin/users')}
          />
        </Box>
      </Box>
    </Box>
  );
};
