// ============================================
// 認証コンテキスト
// ============================================
// グローバルな認証状態を管理

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest } from '@/types';
import {
  mockLogin,
  mockLogout,
  mockVerifyToken,
} from '@/services/api/mockAuthService';
import {
  saveToken,
  getToken,
  removeToken,
  isTokenValid,
} from '@/services/api/tokenService';

// --------------------------------------------
// 認証コンテキストの型定義
// --------------------------------------------

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// --------------------------------------------
// コンテキスト作成
// --------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --------------------------------------------
// AuthProvider コンポーネント
// --------------------------------------------

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --------------------------------------------
  // 初期化：トークンからユーザー情報を復元
  // --------------------------------------------
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();

      if (!token || !isTokenValid()) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await mockVerifyToken(token);
        setUser(userData);
      } catch (error) {
        console.error('トークン検証エラー:', error);
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // --------------------------------------------
  // ログイン
  // --------------------------------------------
  const login = async (credentials: LoginRequest) => {
    try {
      const response = await mockLogin(credentials);
      saveToken(response.token, response.expires_at);
      setUser(response.user);
    } catch (error) {
      console.error('ログインエラー:', error);
      throw error;
    }
  };

  // --------------------------------------------
  // ログアウト
  // --------------------------------------------
  const logout = async () => {
    try {
      await mockLogout();
      removeToken();
      setUser(null);
    } catch (error) {
      console.error('ログアウトエラー:', error);
      throw error;
    }
  };

  // --------------------------------------------
  // ユーザー情報を再取得
  // --------------------------------------------
  const refreshUser = async () => {
    const token = getToken();

    if (!token) {
      throw new Error('トークンが存在しません');
    }

    try {
      const userData = await mockVerifyToken(token);
      setUser(userData);
    } catch (error) {
      console.error('ユーザー情報更新エラー:', error);
      throw error;
    }
  };

  // --------------------------------------------
  // コンテキスト値
  // --------------------------------------------
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --------------------------------------------
// useAuth フック
// --------------------------------------------

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
