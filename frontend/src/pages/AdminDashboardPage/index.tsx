// ============================================
// AdminDashboardPage - 管理ダッシュボード (D-004)
// ============================================
// コーチ専用の管理画面（PC想定、スマホ対応不要）

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Alert } from '@mui/material';
import { MainLayout } from '@/layouts/MainLayout';
import { mockGetSystemStats } from '@/services/api/mockAdminService';
import type { SystemStats } from '@/types';
import PeopleIcon from '@mui/icons-material/People';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MessageIcon from '@mui/icons-material/Message';
import CloudIcon from '@mui/icons-material/Cloud';
import FolderIcon from '@mui/icons-material/Folder';
import HistoryIcon from '@mui/icons-material/History';
import GetAppIcon from '@mui/icons-material/GetApp';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// --------------------------------------------
// 統計カードコンポーネント
// --------------------------------------------

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  unit: string;
  color: 'primary' | 'success' | 'info' | 'warning';
}

const StatCard = ({ icon, label, value, unit, color }: StatCardProps) => {
  const colorMap = {
    primary: '#2c5282',
    success: '#48bb78',
    info: '#4299e1',
    warning: '#ed8936',
  };

  const bgColorMap = {
    primary: 'rgba(44, 82, 130, 0.1)',
    success: 'rgba(72, 187, 120, 0.1)',
    info: 'rgba(66, 153, 225, 0.1)',
    warning: 'rgba(237, 137, 54, 0.1)',
  };

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.15s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: bgColorMap[color],
              color: colorMap[color],
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {label}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              {value}
              <Typography
                component="span"
                variant="h6"
                color="text.secondary"
                sx={{ ml: 0.5, fontWeight: 400 }}
              >
                {unit}
              </Typography>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// --------------------------------------------
// ナビゲーションカードコンポーネント
// --------------------------------------------

interface NavCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  path: string;
  color: 'primary' | 'warning' | 'info' | 'purple' | 'success';
  onClick: () => void;
}

const NavCard = ({ icon, title, description, badge, onClick, color }: NavCardProps) => {
  const colorMap = {
    primary: '#2c5282',
    warning: '#ed8936',
    info: '#4299e1',
    purple: '#9f7aea',
    success: '#48bb78',
  };

  const bgColorMap = {
    primary: 'rgba(44, 82, 130, 0.1)',
    warning: 'rgba(237, 137, 54, 0.1)',
    info: 'rgba(66, 153, 225, 0.1)',
    purple: 'rgba(159, 122, 234, 0.1)',
    success: 'rgba(72, 187, 120, 0.1)',
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.15s ease-in-out',
        border: '2px solid transparent',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
          borderColor: '#3182ce',
        },
      }}
    >
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: bgColorMap[color],
            color: colorMap[color],
            mb: 1,
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 500, mb: 0.5 }}>
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
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'primary.main' }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              管理画面へ
            </Typography>
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </Box>
          <Box
            sx={{
              bgcolor: '#edf2f7',
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

// --------------------------------------------
// AdminDashboardPage コンポーネント
// --------------------------------------------

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // システム統計データ取得
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mockGetSystemStats();
        setStats(data);
      } catch (err) {
        setError('システム統計の取得に失敗しました');
        console.error('Failed to fetch system stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ナビゲーションカードクリックハンドラー
  const handleNavigate = (path: string, title: string) => {
    // MVP段階では未実装機能へのアクセスはアラート表示
    if (
      path === '/admin/knowledge' ||
      path === '/admin/clients' ||
      path === '/admin/export' ||
      path === '/admin/settings' ||
      path === '/admin/profile'
    ) {
      alert(`${title}機能は現在開発中です。近日中に実装予定です。`);
    } else {
      navigate(path);
    }
  };

  return (
    <MainLayout>
      {/* ページヘッダー */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500, mb: 1 }}>
          管理ダッシュボード
        </Typography>
        <Typography variant="body1" color="text.secondary">
          システム全体の統計情報と管理機能へのアクセス
        </Typography>
      </Box>

      {/* エラー表示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 統計カードグリッド */}
      {!loading && stats && (
        <>
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {/* 総ユーザー数 */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <StatCard
                icon={<PeopleIcon sx={{ fontSize: 24 }} />}
                label="総ユーザー数"
                value={stats.total_users}
                unit="人"
                color="primary"
              />
            </Grid>

            {/* 総会話数 */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <StatCard
                icon={<ChatBubbleIcon sx={{ fontSize: 24 }} />}
                label="総会話数"
                value={stats.total_conversations}
                unit="件"
                color="success"
              />
            </Grid>

            {/* 総メッセージ数 */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <StatCard
                icon={<MessageIcon sx={{ fontSize: 24 }} />}
                label="総メッセージ数"
                value={stats.total_messages.toLocaleString()}
                unit="件"
                color="info"
              />
            </Grid>

            {/* API使用状況 */}
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <StatCard
                icon={<CloudIcon sx={{ fontSize: 24 }} />}
                label="API使用状況"
                value={`${Math.floor(
                  (stats.api_usage.claude_tokens + stats.api_usage.openai_tokens) / 1000
                )}K`}
                unit="トークン"
                color="warning"
              />
            </Grid>
          </Grid>

          {/* 管理機能ナビゲーション */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 500, mb: 0.5 }}>
              管理機能
            </Typography>
            <Typography variant="body2" color="text.secondary">
              各管理機能にアクセスできます
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* D-005: ナレッジベース管理 */}
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <NavCard
                icon={<FolderIcon sx={{ fontSize: 28 }} />}
                title="ナレッジベース管理"
                description="システムRAG（専門知識）とユーザーRAG（個別データ）のアップロード・更新・削除を管理します。"
                badge="D-005"
                path="/admin/knowledge"
                color="primary"
                onClick={() => handleNavigate('/admin/knowledge', 'ナレッジベース管理')}
              />
            </Grid>

            {/* D-006: クライアントデータ管理 */}
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <NavCard
                icon={<HistoryIcon sx={{ fontSize: 28 }} />}
                title="クライアントデータ管理"
                description="全クライアントの会話履歴を確認し、危機フラグや引用元情報をチェックできます。"
                badge="D-006"
                path="/admin/clients"
                color="warning"
                onClick={() => handleNavigate('/admin/clients', 'クライアントデータ管理')}
              />
            </Grid>

            {/* D-007: データエクスポート */}
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <NavCard
                icon={<GetAppIcon sx={{ fontSize: 28 }} />}
                title="データエクスポート"
                description="COM:PASSからクライアントデータをエクスポートし、ユーザーRAGに取り込みます。"
                badge="D-007"
                path="/admin/export"
                color="info"
                onClick={() => handleNavigate('/admin/export', 'データエクスポート')}
              />
            </Grid>

            {/* D-008: システム設定 */}
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <NavCard
                icon={<SettingsIcon sx={{ fontSize: 28 }} />}
                title="システム設定"
                description="プロンプト編集、ワークフロー調整、RAG検索設定などのシステム全体の設定を管理します。"
                badge="D-008"
                path="/admin/settings"
                color="purple"
                onClick={() => handleNavigate('/admin/settings', 'システム設定')}
              />
            </Grid>

            {/* D-009: コーチプロファイル設定 */}
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <NavCard
                icon={<PersonIcon sx={{ fontSize: 28 }} />}
                title="コーチプロファイル設定"
                description="コーチ自身のプロフィール情報、通知設定、セキュリティ設定を管理します。"
                badge="D-009"
                path="/admin/profile"
                color="success"
                onClick={() => handleNavigate('/admin/profile', 'コーチプロファイル設定')}
              />
            </Grid>
          </Grid>
        </>
      )}

      {/* ローディング表示 */}
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            読み込み中...
          </Typography>
        </Box>
      )}
    </MainLayout>
  );
};
