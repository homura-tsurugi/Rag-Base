// ============================================
// PublicLayout - 公開ページ用レイアウト
// ============================================
// ログイン、パスワードリセット等の公開ページで使用

import type { ReactNode } from 'react';
import { Box, Container, Paper, AppBar, Toolbar, Typography } from '@mui/material';

interface PublicLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showHeader?: boolean;
}

export const PublicLayout = ({
  children,
  maxWidth = 'sm',
  showHeader = true,
}: PublicLayoutProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* ヘッダー */}
      {showHeader && (
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: 'primary.main',
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'white',
              }}
            >
              RAG-Base
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* メインコンテンツ（中央揃え） */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Container maxWidth={maxWidth}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};
