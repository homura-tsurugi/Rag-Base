// ============================================
// DashboardPage - ダッシュボードページ
// ============================================
// 認証後のホーム画面（Mental-Baseデザイン統一版）

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  LinearProgress,
  Avatar,
} from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

// @MOCK_TO_API: クライアントデータ型定義
interface ClientData {
  id: string;
  name: string;
  email: string;
  progress: number;
  status: 'on-track' | 'stagnant' | 'needs-followup';
  last_activity: string;
}

// @MOCK_TO_API: ステータス設定
const STATUS_CONFIG = {
  'on-track': {
    label: '順調',
    icon: CheckCircleIcon,
    color: 'success' as const,
    bgColor: 'rgba(72, 187, 120, 0.1)',
    textColor: '#48bb78',
  },
  'stagnant': {
    label: '停滞',
    icon: WarningIcon,
    color: 'warning' as const,
    bgColor: 'rgba(236, 201, 75, 0.1)',
    textColor: '#ecc94b',
  },
  'needs-followup': {
    label: '要フォロー',
    icon: ErrorIcon,
    color: 'error' as const,
    bgColor: 'rgba(229, 62, 62, 0.1)',
    textColor: '#e53e3e',
  },
};

// @MOCK_TO_API: モックデータ
const MOCK_CLIENTS: ClientData[] = [
  {
    id: '1',
    name: 'クライアント1',
    email: 'client1@rag-base.local',
    progress: 85,
    status: 'on-track',
    last_activity: '今日',
  },
  {
    id: '2',
    name: 'クライアント2',
    email: 'client2@rag-base.local',
    progress: 45,
    status: 'stagnant',
    last_activity: '5日前',
  },
];

export const DashboardPage = () => {
  const { user } = useAuth();
  const isCoach = user?.role === 'coach';

  // @MOCK_TO_API: フィルター・検索状態
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('progress');

  // @MOCK_TO_API: クライアントデータ取得
  const clients = MOCK_CLIENTS;

  // @MOCK_TO_API: 統計データ計算
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === 'on-track').length;
  const needsFollowup = clients.filter((c) => c.status === 'needs-followup').length;
  const avgProgress = Math.round(clients.reduce((sum, c) => sum + c.progress, 0) / clients.length);

  // フィルター済みクライアント
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // プログレスバーの色を決定
  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'success';
    if (progress >= 40) return 'warning';
    return 'error';
  };

  // アバター用のイニシャル取得
  const getInitial = (name: string) => name.charAt(0);

  return (
    <MainLayout>
      <Box>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            メンターダッシュボード
          </Typography>
          <Typography variant="body1" color="text.secondary">
            担当クライアントの進捗を一目で確認
          </Typography>
        </Box>

        {isCoach ? (
          <>
            {/* Statistics Summary - 2×2 Grid */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 14 }}>
                      担当クライアント総数
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '48px',
                        fontWeight: 700,
                        color: 'primary.main',
                        lineHeight: 1.2,
                      }}
                    >
                      {totalClients}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '16px',
                          color: 'text.secondary',
                          ml: 1,
                          fontWeight: 400,
                        }}
                      >
                        人
                      </Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 14 }}>
                      アクティブクライアント
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '48px',
                        fontWeight: 700,
                        color: 'primary.main',
                        lineHeight: 1.2,
                      }}
                    >
                      {activeClients}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '16px',
                          color: 'text.secondary',
                          ml: 1,
                          fontWeight: 400,
                        }}
                      >
                        人
                      </Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 14 }}>
                      要フォロー
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '48px',
                        fontWeight: 700,
                        color: 'primary.main',
                        lineHeight: 1.2,
                      }}
                    >
                      {needsFollowup}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '16px',
                          color: 'text.secondary',
                          ml: 1,
                          fontWeight: 400,
                        }}
                      >
                        人
                      </Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: 14 }}>
                      平均進捗率
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '48px',
                        fontWeight: 700,
                        color: 'primary.main',
                        lineHeight: 1.2,
                      }}
                    >
                      {avgProgress}
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '16px',
                          color: 'text.secondary',
                          ml: 1,
                          fontWeight: 400,
                        }}
                      >
                        %
                      </Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Search and Filter Controls */}
            <Card sx={{ mb: 4, p: 3, bgcolor: '#f7fafc' }}>
              {/* Search Bar */}
              <TextField
                fullWidth
                placeholder="クライアントを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  bgcolor: 'background.paper',
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                  },
                }}
              />

              {/* Filters Row */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  表示:
                </Typography>

                <Chip
                  label="全て"
                  onClick={() => setFilterStatus('all')}
                  color={filterStatus === 'all' ? 'primary' : 'default'}
                  size="small"
                />
                <Chip
                  label="順調"
                  onClick={() => setFilterStatus('on-track')}
                  color={filterStatus === 'on-track' ? 'primary' : 'default'}
                  size="small"
                />
                <Chip
                  label="停滞"
                  onClick={() => setFilterStatus('stagnant')}
                  color={filterStatus === 'stagnant' ? 'primary' : 'default'}
                  size="small"
                />
                <Chip
                  label="要フォロー"
                  onClick={() => setFilterStatus('needs-followup')}
                  color={filterStatus === 'needs-followup' ? 'primary' : 'default'}
                  size="small"
                />

                <FormControl size="small" sx={{ ml: 'auto', minWidth: 150 }}>
                  <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <MenuItem value="progress">進捗率順</MenuItem>
                    <MenuItem value="activity">最終活動日順</MenuItem>
                    <MenuItem value="name">名前順</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Card>

            {/* Clients Grid - 3 columns */}
            <Grid container spacing={2}>
              {filteredClients.map((client) => {
                const statusConfig = STATUS_CONFIG[client.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={client.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardContent>
                        {/* Client Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: 'secondary.main',
                              width: 40,
                              height: 40,
                              fontWeight: 700,
                            }}
                          >
                            {getInitial(client.name)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={500}>
                              {client.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {client.email}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Progress */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              進捗率
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {client.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={client.progress}
                            color={getProgressColor(client.progress)}
                            sx={{ height: 8, borderRadius: 1 }}
                          />
                        </Box>

                        {/* Meta Info */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            最終活動: {client.last_activity}
                          </Typography>
                          <Chip
                            icon={<StatusIcon />}
                            label={statusConfig.label}
                            size="small"
                            sx={{
                              bgcolor: statusConfig.bgColor,
                              color: statusConfig.textColor,
                              fontWeight: 500,
                              '& .MuiChip-icon': {
                                color: statusConfig.textColor,
                              },
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </>
        ) : (
          /* Client View - Simple Welcome */
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              RAGベースAIコーチングbotへようこそ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AIコーチがあなたの目標達成をサポートします。左側のメニューからAIチャットを開始してください。
            </Typography>
          </Card>
        )}
      </Box>
    </MainLayout>
  );
};
