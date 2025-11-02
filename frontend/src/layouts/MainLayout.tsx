// ============================================
// MainLayout - メインレイアウト
// ============================================
// 認証後のページで使用（ヘッダー + サイドバー）

import { useState, type ReactNode } from 'react';
import { Box, Drawer, Toolbar } from '@mui/material';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 240;

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ヘッダー */}
      <Header onMenuClick={handleDrawerToggle} />

      {/* サイドバー（レスポンシブDrawer） */}
      <Box
        component="nav"
        sx={{
          width: { sm: DRAWER_WIDTH },
          flexShrink: { sm: 0 },
        }}
      >
        {/* モバイル用Drawer（temporary） */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // モバイルパフォーマンス向上
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              bgcolor: '#1e3a5f',
              color: 'white',
            },
          }}
        >
          <Sidebar />
        </Drawer>

        {/* デスクトップ用Drawer（permanent） */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              bgcolor: '#1e3a5f',
              color: 'white',
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: '#f5f7fa',
          minHeight: '100vh',
        }}
      >
        {/* Toolbarスペーサー（Headerの高さ分） */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
