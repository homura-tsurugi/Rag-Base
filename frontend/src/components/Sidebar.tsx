// ============================================
// Sidebar - サイドバーコンポーネント
// ============================================
// HTML mockup完全準拠版

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Hub as HubIcon,
  Home as HomeIcon,
  Flag as FlagIcon,
  Assessment as AssessmentIcon,
  Psychology as PsychologyIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Chat as ChatIcon,
  LibraryBooks as LibraryBooksIcon,
  Insights as InsightsIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// --------------------------------------------
// Sidebarコンポーネント
// --------------------------------------------

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // ユーザーのイニシャルを取得
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'inherit',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        p: '16px 0',
      }}
    >
      {/* Sidebar Header - ロゴ & ユーザー情報 */}
      <Box sx={{ px: 2, mb: 3 }}>
        {/* ロゴ */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            fontSize: '18px',
            fontWeight: 700,
            color: 'white',
            mb: 2,
          }}
        >
          <HubIcon />
          COM:PASS
        </Box>

        {/* ユーザー情報 */}
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
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#4299e1',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {getInitials(user?.name || user?.email)}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: '14px', color: 'white' }}>
              {user?.name || user?.email}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
              {user?.role === 'coach' ? 'コーチ' : 'クライアント'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Nav Menu */}
      <Box sx={{ flex: 1, px: 2 }}>
        {user?.role === 'coach' ? (
          <>
            {/* メインセクション（コーチ用） */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  mb: 1,
                  px: 1,
                  display: 'block',
                }}
              >
                メイン
              </Typography>
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/dashboard'}
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <DashboardIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="ダッシュボード" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/clients'}
                    onClick={() => navigate('/clients')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <PeopleIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="クライアント一覧" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/schedule'}
                    onClick={() => navigate('/schedule')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <CalendarIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="スケジュール" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/messages'}
                    onClick={() => navigate('/messages')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <ChatIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="メッセージ" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>

            {/* ナレッジ管理セクション */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  mb: 1,
                  px: 1,
                  display: 'block',
                }}
              >
                ナレッジ管理
              </Typography>
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/knowledge'}
                    onClick={() => navigate('/knowledge')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <LibraryBooksIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="ナレッジベース" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/analytics'}
                    onClick={() => navigate('/analytics')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <InsightsIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="データ分析" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>

            {/* その他セクション（コーチ用） */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  mb: 1,
                  px: 1,
                  display: 'block',
                }}
              >
                その他
              </Typography>
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/settings'}
                    onClick={() => navigate('/settings')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <SettingsIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="設定" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/help'}
                    onClick={() => navigate('/help')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <HelpIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="ヘルプ" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </>
        ) : (
          <>
            {/* クライアント用メニュー */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  mb: 1,
                  px: 1,
                  display: 'block',
                }}
              >
                クライアント
              </Typography>
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/'}
                    onClick={() => navigate('/')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <HomeIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="ホーム" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/plan-do'}
                    onClick={() => navigate('/plan-do')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <FlagIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="目標・実行" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/check-action'}
                    onClick={() => navigate('/check-action')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <AssessmentIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="振り返り・改善" />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/chat'}
                    onClick={() => navigate('/chat')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <PsychologyIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="AIアシスタント" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>

            {/* その他セクション（クライアント用） */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.6)',
                  textTransform: 'uppercase',
                  mb: 1,
                  px: 1,
                  display: 'block',
                }}
              >
                その他
              </Typography>
              <List disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === '/settings'}
                    onClick={() => navigate('/settings')}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        bgcolor: '#2c5282',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2c5282',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                      <SettingsIcon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText primary="設定" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
