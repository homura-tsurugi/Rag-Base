/**
 * MUIテーマ使用例
 * Mental-Base準拠デザインシステム
 */

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  Chip,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * 基本的なカラーパレット使用例
 */
export function ColorPaletteExample() {
  return (
    <Box sx={{ p: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Button variant="contained" color="primary">
        Primary
      </Button>
      <Button variant="contained" color="secondary">
        Secondary
      </Button>
      <Button variant="contained" color="success">
        Success
      </Button>
      <Button variant="contained" color="warning">
        Warning
      </Button>
      <Button variant="contained" color="error">
        Error
      </Button>
    </Box>
  );
}

/**
 * COMPASS固有カラー使用例
 */
export function CompassColorsExample() {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.compass.plan,
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Plan</Typography>
        <Typography variant="body2">計画フェーズ</Typography>
      </Paper>

      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.compass.do,
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Do</Typography>
        <Typography variant="body2">実行フェーズ</Typography>
      </Paper>

      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.compass.check,
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Check</Typography>
        <Typography variant="body2">評価フェーズ</Typography>
      </Paper>

      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.compass.action,
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6">Action</Typography>
        <Typography variant="body2">改善フェーズ</Typography>
      </Paper>
    </Box>
  );
}

/**
 * タイポグラフィ使用例
 */
export function TypographyExample() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h1" gutterBottom>
        見出し1 - ページタイトル
      </Typography>
      <Typography variant="h2" gutterBottom>
        見出し2 - セクションタイトル
      </Typography>
      <Typography variant="h3" gutterBottom>
        見出し3 - サブセクション
      </Typography>
      <Typography variant="h4" gutterBottom>
        見出し4 - カードタイトル
      </Typography>
      <Typography variant="h5" gutterBottom>
        見出し5 - 小見出し
      </Typography>
      <Typography variant="h6" gutterBottom>
        見出し6 - 最小見出し
      </Typography>
      <Typography variant="body1" gutterBottom>
        本文1 - これは標準的な本文テキストです。読みやすさを考慮したフォントサイズとラインハイトが設定されています。
      </Typography>
      <Typography variant="body2" gutterBottom>
        本文2 - これは小さめの本文テキストです。補足情報などに使用します。
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        キャプション - 画像や表の説明文などに使用します。
      </Typography>
    </Box>
  );
}

/**
 * フォーム要素使用例
 */
export function FormExample() {
  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            ユーザー登録
          </Typography>

          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="名前" fullWidth placeholder="山田太郎" />

            <TextField
              label="メールアドレス"
              type="email"
              fullWidth
              placeholder="example@email.com"
            />

            <TextField
              label="パスワード"
              type="password"
              fullWidth
              placeholder="8文字以上"
            />

            <TextField
              label="自己紹介"
              multiline
              rows={4}
              fullWidth
              placeholder="簡単な自己紹介を入力してください"
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined">キャンセル</Button>
              <Button variant="contained" color="primary">
                登録
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

/**
 * アラート・フィードバック使用例
 */
export function FeedbackExample() {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Alert severity="success">
        登録が完了しました。メールをご確認ください。
      </Alert>

      <Alert severity="info">
        新しい機能が追加されました。ぜひお試しください。
      </Alert>

      <Alert severity="warning">
        パスワードの有効期限が近づいています。
      </Alert>

      <Alert severity="error">
        エラーが発生しました。もう一度お試しください。
      </Alert>
    </Box>
  );
}

/**
 * チップ使用例
 */
export function ChipExample() {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Chip label="React" color="primary" />
      <Chip label="TypeScript" color="secondary" />
      <Chip label="完了" color="success" />
      <Chip label="警告" color="warning" />
      <Chip label="エラー" color="error" />

      {/* COMPASS固有カラー使用 */}
      <Chip
        label="Plan"
        sx={{
          bgcolor: theme.palette.compass.plan,
          color: 'white',
        }}
      />
      <Chip
        label="Do"
        sx={{
          bgcolor: theme.palette.compass.do,
          color: 'white',
        }}
      />
      <Chip
        label="Check"
        sx={{
          bgcolor: theme.palette.compass.check,
          color: 'white',
        }}
      />
      <Chip
        label="Action"
        sx={{
          bgcolor: theme.palette.compass.action,
          color: 'white',
        }}
      />
    </Box>
  );
}

/**
 * カードレイアウト使用例
 */
export function CardLayoutExample() {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: theme.palette.compass.plan,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              mb: 2,
            }}
          >
            P
          </Box>
          <Typography variant="h6" gutterBottom>
            Plan（計画）
          </Typography>
          <Typography variant="body2" color="text.secondary">
            目標設定と計画立案を行います。クライアントとともに具体的なアクションプランを作成します。
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: theme.palette.compass.do,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              mb: 2,
            }}
          >
            D
          </Box>
          <Typography variant="h6" gutterBottom>
            Do（実行）
          </Typography>
          <Typography variant="body2" color="text.secondary">
            計画を実行に移します。日々の行動を記録し、進捗を確認します。
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: theme.palette.compass.check,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              mb: 2,
            }}
          >
            C
          </Box>
          <Typography variant="h6" gutterBottom>
            Check（評価）
          </Typography>
          <Typography variant="body2" color="text.secondary">
            実行結果を振り返り、目標達成度を評価します。学びと気づきを共有します。
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: theme.palette.compass.action,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              mb: 2,
            }}
          >
            A
          </Box>
          <Typography variant="h6" gutterBottom>
            Action（改善）
          </Typography>
          <Typography variant="body2" color="text.secondary">
            評価を基に改善策を立案します。次のサイクルに向けて行動を最適化します。
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

/**
 * レスポンシブレイアウト使用例
 */
export function ResponsiveLayoutExample() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 }, // レスポンシブパディング
        maxWidth: 'lg',
        mx: 'auto',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, // レスポンシブフォントサイズ
        }}
      >
        レスポンシブレイアウト
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr', // スマホ: 1列
            sm: 'repeat(2, 1fr)', // タブレット: 2列
            md: 'repeat(3, 1fr)', // PC: 3列
          },
          gap: 2,
          mt: 3,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <Card key={num}>
            <CardContent>
              <Typography variant="h6">カード {num}</Typography>
              <Typography variant="body2" color="text.secondary">
                レスポンシブグリッドレイアウトのサンプルです。
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
