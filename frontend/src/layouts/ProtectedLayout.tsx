// ============================================
// ProtectedLayout - 保護されたページ用レイアウト
// ============================================
// 認証が必要なページで使用（クライアント権限のみ）

import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedLayoutProps {
  children: ReactNode;
  requiredRole?: 'client' | 'coach';
}

export const ProtectedLayout = ({
  children,
  requiredRole = 'client',
}: ProtectedLayoutProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // ローディング中
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  // 未認証の場合はログインページへリダイレクト
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 権限チェック（クライアント権限が必要な場合）
  if (requiredRole && user.role !== requiredRole) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          flexDirection: 'column',
          gap: 2,
          p: 3,
        }}
      >
        <Box sx={{ fontSize: '48px' }}>🚫</Box>
        <Box sx={{ fontSize: '20px', fontWeight: 500, color: 'text.primary' }}>
          アクセス権限がありません
        </Box>
        <Box sx={{ fontSize: '14px', color: 'text.secondary' }}>
          このページは{requiredRole === 'client' ? 'クライアント' : 'コーチ'}
          専用ページです
        </Box>
      </Box>
    );
  }

  // 認証済み・権限OKの場合はコンテンツを表示
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {children}
    </Box>
  );
};
