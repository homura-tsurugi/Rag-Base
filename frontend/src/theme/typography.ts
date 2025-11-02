import type { ThemeOptions } from '@mui/material/styles';

/**
 * Mental-Base準拠タイポグラフィ設定
 * RAGベースAIコーチングbot - 統合デザインシステム
 */

const typography: ThemeOptions['typography'] = {
  // フォントファミリー
  fontFamily: [
    'Roboto',
    'Noto Sans JP',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),

  // 基本フォントサイズ
  fontSize: 14,

  // 見出し1（ページタイトル）
  h1: {
    fontSize: '2.5rem', // 40px
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
    color: '#2d3748',
  },

  // 見出し2（セクションタイトル）
  h2: {
    fontSize: '2rem', // 32px
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.00833em',
    color: '#2d3748',
  },

  // 見出し3（サブセクション）
  h3: {
    fontSize: '1.75rem', // 28px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0em',
    color: '#2d3748',
  },

  // 見出し4（カード/パネルタイトル）
  h4: {
    fontSize: '1.5rem', // 24px
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.00735em',
    color: '#2d3748',
  },

  // 見出し5（小見出し）
  h5: {
    fontSize: '1.25rem', // 20px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: '0em',
    color: '#2d3748',
  },

  // 見出し6（最小見出し）
  h6: {
    fontSize: '1rem', // 16px
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
    color: '#2d3748',
  },

  // 本文1（標準本文）
  body1: {
    fontSize: '1rem', // 16px
    fontWeight: 400,
    lineHeight: 1.7,
    letterSpacing: '0.00938em',
    color: '#2d3748',
  },

  // 本文2（小サイズ本文）
  body2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 400,
    lineHeight: 1.6,
    letterSpacing: '0.01071em',
    color: '#4a5568',
  },

  // サブタイトル1
  subtitle1: {
    fontSize: '1rem', // 16px
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: '0.00938em',
    color: '#2d3748',
  },

  // サブタイトル2
  subtitle2: {
    fontSize: '0.875rem', // 14px
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: '0.00714em',
    color: '#4a5568',
  },

  // ボタン
  button: {
    fontSize: '0.875rem', // 14px
    fontWeight: 600,
    lineHeight: 1.75,
    letterSpacing: '0.02857em',
    textTransform: 'none', // 大文字変換なし
  },

  // キャプション（補足説明）
  caption: {
    fontSize: '0.75rem', // 12px
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
    color: '#718096',
  },

  // オーバーライン（ラベル）
  overline: {
    fontSize: '0.75rem', // 12px
    fontWeight: 600,
    lineHeight: 2.66,
    letterSpacing: '0.08333em',
    textTransform: 'uppercase',
    color: '#718096',
  },
};

export default typography;
