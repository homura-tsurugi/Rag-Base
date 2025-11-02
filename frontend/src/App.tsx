// ============================================
// App - メインアプリケーション
// ============================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/public/LoginPage';
import { ChatPage } from '@/pages/ChatPage/index';
import { ConversationHistoryPage } from '@/pages/ConversationHistoryPage/index';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage/index';
import { Box, CircularProgress } from '@mui/material';
import type { ReactNode } from 'react';

// --------------------------------------------
// ProtectedRoute - 認証が必要なルート
// --------------------------------------------

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// --------------------------------------------
// RoleBasedRedirect - 役割に基づくリダイレクト
// --------------------------------------------

const RoleBasedRedirect = () => {
  const { user } = useAuth();

  // コーチ → 管理ダッシュボード、クライアント → AIチャット
  const redirectPath = user?.role === 'coach' ? '/admin' : '/chat';

  return <Navigate to={redirectPath} replace />;
};

// --------------------------------------------
// App コンポーネント
// --------------------------------------------

function App() {
  return (
    <Routes>
      {/* 公開ルート */}
      <Route path="/login" element={<LoginPage />} />

      {/* 認証が必要なルート */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <ConversationHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* デフォルトルート - 役割に基づいてリダイレクト */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoleBasedRedirect />
          </ProtectedRoute>
        }
      />

      {/* 404 - 役割に基づいてリダイレクト */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <RoleBasedRedirect />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
