# MUIテーマ統合ガイド

## クイックスタート

### 1. main.tsxでテーマを適用

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### 2. コンポーネントでテーマを使用

```tsx
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to RAG-Base
      </Typography>

      <Button variant="contained" color="primary">
        Get Started
      </Button>

      {/* COMPASS固有カラーの使用 */}
      <Box
        sx={{
          bgcolor: theme.palette.compass.plan,
          color: 'white',
          p: 2,
          mt: 2,
          borderRadius: 2,
        }}
      >
        Plan Phase
      </Box>
    </Box>
  );
}
```

## 重要な変更点（MUI v7対応）

### TypographyOptions型の廃止

MUI v7では`TypographyOptions`型が削除されました。以下のように対応してください：

**❌ 旧方式（v5/v6）:**
```tsx
import { TypographyOptions } from '@mui/material/styles/createTypography';

const typography: TypographyOptions = {
  fontFamily: 'Roboto',
  // ...
};
```

**✅ 新方式（v7）:**
```tsx
import type { ThemeOptions } from '@mui/material/styles';

const typography: ThemeOptions['typography'] = {
  fontFamily: 'Roboto',
  // ...
};
```

### Type-Only Import必須

TypeScriptの`verbatimModuleSyntax`が有効な場合、型のみのインポートは`type`キーワードを使用する必要があります：

**❌ NG:**
```tsx
import { Components, Theme } from '@mui/material/styles';
```

**✅ OK:**
```tsx
import type { Components, Theme } from '@mui/material/styles';
```

## ファイル構成

```
src/theme/
├── index.ts          # メインテーマファイル（エクスポート用）
├── palette.ts        # カラーパレット定義
├── typography.ts     # タイポグラフィ設定
├── components.ts     # コンポーネントスタイルオーバーライド
├── examples.tsx      # 使用例コンポーネント集
├── README.md         # 詳細ドキュメント
└── INTEGRATION.md    # 統合ガイド（このファイル）
```

## COMPASS固有カラーの使用

### パレット拡張

`palette.ts`でCOMPASS固有カラーを定義しています：

```typescript
compass: {
  plan: '#2c5282',    // 計画フェーズ
  do: '#48bb78',      // 実行フェーズ
  check: '#ed8936',   // 評価フェーズ
  action: '#9f7aea',  // 改善フェーズ
}
```

### 使用例

```tsx
import { Box, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function PDCAPhases() {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Chip
        label="Plan"
        sx={{ bgcolor: theme.palette.compass.plan, color: 'white' }}
      />
      <Chip
        label="Do"
        sx={{ bgcolor: theme.palette.compass.do, color: 'white' }}
      />
      <Chip
        label="Check"
        sx={{ bgcolor: theme.palette.compass.check, color: 'white' }}
      />
      <Chip
        label="Action"
        sx={{ bgcolor: theme.palette.compass.action, color: 'white' }}
      />
    </Box>
  );
}
```

## カスタマイズ方法

### カラーの変更

`src/theme/palette.ts`を編集：

```typescript
primary: {
  main: '#2c5282',  // ← ここを変更
  light: '#3182ce',
  dark: '#1a365d',
  contrastText: '#ffffff',
},
```

### タイポグラフィの変更

`src/theme/typography.ts`を編集：

```typescript
h1: {
  fontSize: '2.5rem', // ← フォントサイズ変更
  fontWeight: 700,    // ← 太さ変更
  lineHeight: 1.2,    // ← 行間変更
  letterSpacing: '-0.01562em',
  color: '#2d3748',
},
```

### コンポーネントスタイルの変更

`src/theme/components.ts`を編集：

```typescript
MuiButton: {
  styleOverrides: {
    root: {
      borderRadius: 8,  // ← ボーダー半径変更
      padding: '10px 24px', // ← パディング変更
      // ...
    },
  },
},
```

## トラブルシューティング

### ビルドエラー: "TypographyOptions is not exported"

MUI v7では`TypographyOptions`が削除されました。`ThemeOptions['typography']`を使用してください。

### 型エラー: "must be imported using a type-only import"

TypeScriptの設定で`verbatimModuleSyntax: true`が有効になっています。型のインポートには`import type`を使用してください。

### COMPASSカラーが使えない

TypeScriptの型拡張が正しく認識されていない可能性があります。`palette.ts`の`declare module`が正しく定義されていることを確認してください。

### テーマが反映されない

`main.tsx`で`ThemeProvider`でアプリ全体をラップしていることを確認してください。

## パフォーマンス最適化

### 1. 動的スタイルの最小化

```tsx
// ❌ 避ける（毎レンダリングで新しいオブジェクト生成）
<Box sx={{ p: 3, mt: 2, bgcolor: 'primary.main' }}>

// ✅ 推奨（useMemoでメモ化）
const boxStyles = useMemo(() => ({
  p: 3,
  mt: 2,
  bgcolor: 'primary.main'
}), []);

<Box sx={boxStyles}>
```

### 2. styled componentの活用

頻繁に使用するスタイルは`styled`でコンポーネント化：

```tsx
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const StyledCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

// 使用
<StyledCard>Content</StyledCard>
```

## 参考リンク

- [MUI公式ドキュメント](https://mui.com/)
- [MUI v7移行ガイド](https://next.mui.com/material-ui/migration/upgrade-to-v7/)
- [カスタマイズガイド](https://mui.com/material-ui/customization/theming/)
- [テーマ詳細ドキュメント](./README.md)
- [使用例コンポーネント](./examples.tsx)
