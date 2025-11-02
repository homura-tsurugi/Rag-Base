# MUIテーマ - Mental-Base準拠

RAGベースAIコーチングbot用のMUIテーマ実装です。

## 概要

このテーマは、Mental-Baseデザインシステムに基づいており、以下の4つのファイルで構成されています：

### ファイル構成

1. **palette.ts** - カラーパレット定義
2. **typography.ts** - タイポグラフィ設定
3. **components.ts** - コンポーネントスタイルオーバーライド
4. **index.ts** - メインテーマファイル

## 使用方法

### 基本的な使い方

```tsx
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <YourApp />
    </ThemeProvider>
  );
}
```

### カラーパレット

#### 基本カラー

```tsx
import { Button } from '@mui/material';

// Primary
<Button color="primary">Primary</Button>

// Secondary
<Button color="secondary">Secondary</Button>

// Success
<Button color="success">Success</Button>

// Warning
<Button color="warning">Warning</Button>

// Error
<Button color="error">Error</Button>
```

#### COMPASS固有カラー

```tsx
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function CompassPhases() {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ bgcolor: theme.palette.compass.plan }}>Plan</Box>
      <Box sx={{ bgcolor: theme.palette.compass.do }}>Do</Box>
      <Box sx={{ bgcolor: theme.palette.compass.check }}>Check</Box>
      <Box sx={{ bgcolor: theme.palette.compass.action }}>Action</Box>
    </>
  );
}
```

### タイポグラフィ

```tsx
import { Typography } from '@mui/material';

<Typography variant="h1">見出し1</Typography>
<Typography variant="h2">見出し2</Typography>
<Typography variant="body1">本文1</Typography>
<Typography variant="body2">本文2</Typography>
<Typography variant="caption">キャプション</Typography>
```

### カスタムスタイリング

```tsx
import { Box, Button } from '@mui/material';

// sx propを使用
<Box
  sx={{
    p: 3, // padding: 24px (3 * 8px)
    mt: 2, // margin-top: 16px (2 * 8px)
    bgcolor: 'background.paper',
    borderRadius: 2,
  }}
>
  コンテンツ
</Box>

// テーマカラーの直接参照
<Button
  sx={{
    bgcolor: 'primary.main',
    '&:hover': {
      bgcolor: 'primary.dark',
    }
  }}
>
  カスタムボタン
</Button>
```

## カラーパレット一覧

### メインカラー

| カラー | 値 | 用途 |
|--------|-----|------|
| Primary | #2c5282 | メインアクション |
| Primary Light | #3182ce | ホバー状態 |
| Primary Dark | #1a365d | アクティブ状態 |
| Secondary | #4299e1 | サブアクション |
| Secondary Light | #63b3ed | ホバー状態 |
| Secondary Dark | #2b6cb0 | アクティブ状態 |

### フィードバックカラー

| カラー | 値 | 用途 |
|--------|-----|------|
| Success | #48bb78 | 成功メッセージ |
| Success Light | #68d391 | 成功背景 |
| Success Dark | #2f855a | 成功ボーダー |
| Warning | #ed8936 | 警告メッセージ |
| Warning Light | #f6ad55 | 警告背景 |
| Warning Dark | #c05621 | 警告ボーダー |
| Error | #f56565 | エラーメッセージ |
| Error Light | #fc8181 | エラー背景 |
| Error Dark | #c53030 | エラーボーダー |

### COMPASS固有カラー

| カラー | 値 | 用途 |
|--------|-----|------|
| Plan | #2c5282 | 計画フェーズ |
| Do | #48bb78 | 実行フェーズ |
| Check | #ed8936 | 評価フェーズ |
| Action | #9f7aea | 改善フェーズ |

### ニュートラルカラー

| カラー | 値 | 用途 |
|--------|-----|------|
| Background Default | #ffffff | ページ背景 |
| Background Paper | #f7fafc | カード背景 |
| Text Primary | #2d3748 | メインテキスト |
| Text Secondary | #4a5568 | サブテキスト |
| Text Disabled | #a0aec0 | 無効テキスト |
| Border | #e2e8f0 | ボーダー |
| Border Dark | #cbd5e0 | 濃いボーダー |

## タイポグラフィ設定

### フォントファミリー

- Primary: Roboto
- Secondary: Noto Sans JP
- Fallback: システムフォント

### フォントサイズ

| バリアント | サイズ | 太さ | 用途 |
|-----------|-------|------|------|
| h1 | 40px | 700 | ページタイトル |
| h2 | 32px | 600 | セクションタイトル |
| h3 | 28px | 600 | サブセクション |
| h4 | 24px | 600 | カードタイトル |
| h5 | 20px | 500 | 小見出し |
| h6 | 16px | 500 | 最小見出し |
| body1 | 16px | 400 | 標準本文 |
| body2 | 14px | 400 | 小サイズ本文 |
| button | 14px | 600 | ボタン |
| caption | 12px | 400 | 補足説明 |

## コンポーネントのカスタマイズ

### Button

- ボーダー半径: 8px
- デフォルトでシャドウなし
- ホバー時にシャドウ表示
- テキスト変換なし（textTransform: 'none'）

### TextField

- ボーダー半径: 8px
- フォーカス時にボーダー幅2px
- アウトライン型がデフォルト

### Card

- ボーダー半径: 12px
- ホバー時にシャドウ強調
- デフォルトで軽いシャドウ

### その他

- Alert、Chip、Dialog、Tooltipなども統一されたスタイルでカスタマイズ済み

## ベストプラクティス

1. **色の一貫性**: テーマで定義された色を使用し、ハードコーディングを避ける
2. **スペーシング**: `theme.spacing()`または`sx`のスペーシングユニット（8pxベース）を使用
3. **レスポンシブデザイン**: ブレークポイントを活用してレスポンシブに
4. **アクセシビリティ**: コントラスト比を考慮したカラー選択

## トラブルシューティング

### テーマが適用されない

`ThemeProvider`でアプリ全体を囲んでいることを確認してください：

```tsx
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### COMPASS固有カラーが使えない

TypeScriptの型定義が正しく適用されているか確認してください。`palette.ts`で型拡張を定義しています。

### カスタムスタイルが反映されない

MUIの`sx` propまたは`styled`を使用していることを確認してください。通常のCSSクラスでは優先度が低い場合があります。

## 参考資料

- [MUI公式ドキュメント](https://mui.com/)
- [カスタマイズガイド](https://mui.com/material-ui/customization/theming/)
- [Mental-Baseデザインシステム](/docs/design-system.md)
