import type { Components, Theme } from '@mui/material/styles';

/**
 * Mental-Base準拠コンポーネントスタイルオーバーライド
 * RAGベースAIコーチングbot - 統合デザインシステム
 */

const components: Components<Theme> = {
  // Button
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 24px',
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      },
      outlined: {
        borderWidth: 1.5,
        '&:hover': {
          borderWidth: 1.5,
        },
      },
      sizeSmall: {
        padding: '6px 16px',
        fontSize: '0.8125rem',
      },
      sizeLarge: {
        padding: '12px 32px',
        fontSize: '0.9375rem',
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },

  // TextField
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '& fieldset': {
            borderColor: '#e2e8f0',
            borderWidth: 1.5,
          },
          '&:hover fieldset': {
            borderColor: '#cbd5e0',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#2c5282',
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-root': {
          color: '#718096',
          '&.Mui-focused': {
            color: '#2c5282',
          },
        },
      },
    },
    defaultProps: {
      variant: 'outlined',
    },
  },

  // Card
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },

  // Paper
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      rounded: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
      elevation2: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      elevation3: {
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
    },
  },

  // Dialog
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        padding: '8px',
      },
    },
  },

  // AppBar
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
      colorPrimary: {
        backgroundColor: '#2c5282',
      },
    },
  },

  // Chip
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
      filled: {
        '&.MuiChip-colorPrimary': {
          backgroundColor: '#2c5282',
          color: '#ffffff',
        },
        '&.MuiChip-colorSecondary': {
          backgroundColor: '#4299e1',
          color: '#ffffff',
        },
        '&.MuiChip-colorSuccess': {
          backgroundColor: '#48bb78',
          color: '#ffffff',
        },
        '&.MuiChip-colorWarning': {
          backgroundColor: '#ed8936',
          color: '#ffffff',
        },
        '&.MuiChip-colorError': {
          backgroundColor: '#f56565',
          color: '#ffffff',
        },
      },
      outlined: {
        borderWidth: 1.5,
      },
    },
  },

  // Alert
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '12px 16px',
      },
      standardSuccess: {
        backgroundColor: '#f0fff4',
        color: '#2f855a',
      },
      standardWarning: {
        backgroundColor: '#fffaf0',
        color: '#c05621',
      },
      standardError: {
        backgroundColor: '#fff5f5',
        color: '#c53030',
      },
      standardInfo: {
        backgroundColor: '#ebf8ff',
        color: '#2b6cb0',
      },
    },
  },

  // Tooltip
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: '#2d3748',
        fontSize: '0.875rem',
        borderRadius: 6,
        padding: '8px 12px',
      },
      arrow: {
        color: '#2d3748',
      },
    },
  },

  // Table
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid #e2e8f0',
        padding: '16px',
      },
      head: {
        backgroundColor: '#f7fafc',
        color: '#2d3748',
        fontWeight: 600,
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      },
    },
  },

  // Switch
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 52,
        height: 32,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 4,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: '#ffffff',
            '& + .MuiSwitch-track': {
              backgroundColor: '#48bb78',
              opacity: 1,
            },
          },
        },
        '& .MuiSwitch-thumb': {
          width: 24,
          height: 24,
        },
        '& .MuiSwitch-track': {
          borderRadius: 16,
          backgroundColor: '#cbd5e0',
          opacity: 1,
        },
      },
    },
  },

  // Radio
  MuiRadio: {
    styleOverrides: {
      root: {
        color: '#cbd5e0',
        '&.Mui-checked': {
          color: '#2c5282',
        },
      },
    },
  },

  // Checkbox
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: '#cbd5e0',
        '&.Mui-checked': {
          color: '#2c5282',
        },
      },
    },
  },

  // Tabs
  MuiTabs: {
    styleOverrides: {
      root: {
        borderBottom: '2px solid #e2e8f0',
      },
      indicator: {
        backgroundColor: '#2c5282',
        height: 3,
      },
    },
  },

  // Tab
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.9375rem',
        minHeight: 48,
        color: '#718096',
        '&.Mui-selected': {
          color: '#2c5282',
          fontWeight: 600,
        },
      },
    },
  },

  // Divider
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: '#e2e8f0',
      },
    },
  },

  // LinearProgress
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        height: 8,
      },
      bar: {
        borderRadius: 4,
      },
    },
  },

  // CircularProgress
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        color: '#2c5282',
      },
    },
  },
};

export default components;
