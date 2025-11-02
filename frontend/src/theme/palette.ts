import type { PaletteOptions } from '@mui/material/styles';

/**
 * Mental-Base準拠カラーパレット定義
 * RAGベースAIコーチングbot - 統合デザインシステム
 */

declare module '@mui/material/styles' {
  interface Palette {
    compass: {
      plan: string;
      do: string;
      check: string;
      action: string;
    };
    ai: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    compass?: {
      plan?: string;
      do?: string;
      check?: string;
      action?: string;
    };
    ai?: {
      main?: string;
      light?: string;
      dark?: string;
    };
  }
}

const palette: PaletteOptions = {
  // Primary Colors
  primary: {
    main: '#2c5282',
    light: '#3182ce',
    dark: '#1a365d',
    contrastText: '#ffffff',
  },

  // Secondary Colors
  secondary: {
    main: '#4299e1',
    light: '#63b3ed',
    dark: '#2b6cb0',
    contrastText: '#ffffff',
  },

  // Success Colors
  success: {
    main: '#48bb78',
    light: '#68d391',
    dark: '#2f855a',
    contrastText: '#ffffff',
  },

  // Warning Colors
  warning: {
    main: '#ed8936',
    light: '#f6ad55',
    dark: '#c05621',
    contrastText: '#ffffff',
  },

  // Error Colors
  error: {
    main: '#f56565',
    light: '#fc8181',
    dark: '#c53030',
    contrastText: '#ffffff',
  },

  // Info Colors
  info: {
    main: '#4299e1',
    light: '#63b3ed',
    dark: '#2b6cb0',
    contrastText: '#ffffff',
  },

  // COMPASS固有カラー
  compass: {
    plan: '#2c5282',
    do: '#48bb78',
    check: '#ed8936',
    action: '#9f7aea',
  },

  // AI専用カラー（パープル系）
  ai: {
    main: '#9f7aea',
    light: '#b794f4',
    dark: '#805ad5',
  },

  // Background Colors
  background: {
    default: '#ffffff',
    paper: '#f7fafc',
  },

  // Text Colors
  text: {
    primary: '#2d3748',
    secondary: '#4a5568',
    disabled: '#a0aec0',
  },

  // Divider Color
  divider: '#e2e8f0',

  // Action Colors
  action: {
    active: '#2c5282',
    hover: 'rgba(44, 82, 130, 0.04)',
    selected: 'rgba(44, 82, 130, 0.08)',
    disabled: '#a0aec0',
    disabledBackground: '#edf2f7',
    focus: 'rgba(44, 82, 130, 0.12)',
  },

  // Mode
  mode: 'light',
};

export default palette;
