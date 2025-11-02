// ============================================
// LoginPage - ログインページ
// ============================================

import { useState, type FormEvent } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import ErrorIcon from '@mui/icons-material/Error';
import { PublicLayout } from '@/layouts/PublicLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMockUsers } from '@/services/api/mockAuthService';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      // ログイン成功後はルートにリダイレクト（役割に応じて自動振り分け）
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // デモアカウント情報
  const demoUsers = getMockUsers();

  return (
    <PublicLayout showHeader={false}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* ロゴ */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 1,
            }}
          >
            <HubIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" fontWeight={700} color="primary.main">
              COM:PASS
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            RAGベースAIコーチング
          </Typography>
        </Box>

        {/* フォームタイトル */}
        <Typography variant="h5" component="h2" gutterBottom align="center" fontWeight={600} sx={{ mb: 3 }}>
          ログイン
        </Typography>

        {/* エラーメッセージ */}
        {error && (
          <Alert
            severity="error"
            icon={<ErrorIcon />}
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        {/* メールアドレス */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" component="label" fontWeight={500} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            メールアドレス
          </Typography>
          <TextField
            type="email"
            fullWidth
            required
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        {/* パスワード */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" component="label" fontWeight={500} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            パスワード
          </Typography>
          <TextField
            type="password"
            fullWidth
            required
            placeholder="8文字以上"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>

        {/* ログインボタン */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{
            mt: 1,
            py: 1.5,
            fontWeight: 600,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 2,
            },
            transition: 'all 0.15s ease-in-out',
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'ログイン'}
        </Button>

        {/* デモアカウント情報 */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            デモアカウント:
          </Typography>
          {demoUsers.map((user, index) => (
            <Typography key={index} variant="caption" display="block" sx={{ fontFamily: 'monospace' }}>
              {user.email} ({user.role === 'coach' ? 'コーチ' : 'クライアント'})
            </Typography>
          ))}
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            パスワード: コーチ→TestCoach2025! / クライアント→TestClient2025!
          </Typography>
        </Box>
      </Box>
    </PublicLayout>
  );
};
