// ============================================
// ProfilePage - プロフィールページ
// ============================================

import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
          プロフィール
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {user.avatar ? (
              <Avatar
                src={user.avatar}
                alt={user.name || user.email}
                sx={{ width: 80, height: 80, mr: 2 }}
              />
            ) : (
              <Avatar sx={{ width: 80, height: 80, mr: 2, bgcolor: 'primary.main', fontSize: '2rem' }}>
                {user.name?.[0] || user.email[0].toUpperCase()}
              </Avatar>
            )}

            <Box>
              <Typography variant="h5" fontWeight={600}>
                {user.name || 'ユーザー'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Chip
                label={user.role === 'coach' ? 'コーチ' : 'クライアント'}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              アカウント情報
            </Typography>

            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ユーザーID
                </Typography>
                <Typography variant="body2">{user.user_id}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  メールアドレス
                </Typography>
                <Typography variant="body2">{user.email}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  権限
                </Typography>
                <Typography variant="body2">
                  {user.role === 'coach' ? 'コーチ（管理者）' : 'クライアント'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  登録日
                </Typography>
                <Typography variant="body2">
                  {new Date(user.created_at).toLocaleDateString('ja-JP')}
                </Typography>
              </Box>

              {user.last_login_at && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    最終ログイン
                  </Typography>
                  <Typography variant="body2">
                    {new Date(user.last_login_at).toLocaleString('ja-JP')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
};
