// ============================================
// ConversationSummariesPage - 会話要約一覧（クライアント用）
// ============================================
// 自分の会話要約を閲覧するページ

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Chat as ChatIcon,
  Lightbulb as LightbulbIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import type { ConversationSummary } from '@/types';
import { getConversationSummaries } from '@/services/api/conversationSummaryService';

export const ConversationSummariesPage = () => {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSummaries();
    }
  }, [user]);

  const loadSummaries = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getConversationSummaries(user.user_id);
      setSummaries(data);
      setError(null);
    } catch (err) {
      console.error('要約データの取得に失敗:', err);
      setError('要約データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        {/* ページヘッダー */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 1 }}>
            会話要約
          </Typography>
          <Typography variant="body1" color="text.secondary">
            これまでの会話の要約を確認できます
          </Typography>
        </Box>

        {/* エラー表示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 要約がない場合 */}
        {summaries.length === 0 && !error && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <ChatIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                会話要約がまだありません
              </Typography>
              <Typography variant="body2" color="text.secondary">
                チャットで会話を終了すると、要約がここに表示されます
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* 要約一覧 */}
        <Stack spacing={3}>
          {summaries.map((summary) => (
            <Card key={summary.summary_id}>
              <CardContent>
                {/* 要約ヘッダー */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                      会話要約
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(summary.created_at)}
                    </Typography>
                  </Box>
                  {summary.crisis_flags && summary.crisis_flags.length > 0 && (
                    <Chip
                      icon={<WarningIcon />}
                      label="要注意"
                      color="error"
                      size="small"
                    />
                  )}
                </Box>

                {/* トピック */}
                {summary.topics.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ChatIcon sx={{ fontSize: 18 }} />
                      主なトピック
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {summary.topics.map((topic, index) => (
                        <Chip key={index} label={topic} size="small" />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* アコーディオン: 詳細情報 */}
                <Stack spacing={1}>
                  {/* 問題・課題 */}
                  {summary.problems.length > 0 && (
                    <Accordion elevation={0} sx={{ bgcolor: 'grey.50' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <WarningIcon sx={{ fontSize: 18, color: 'warning.main' }} />
                          問題・課題 ({summary.problems.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {summary.problems.map((problem, index) => (
                            <Typography key={index} variant="body2">
                              • {problem}
                            </Typography>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* アドバイス */}
                  {summary.advice.length > 0 && (
                    <Accordion elevation={0} sx={{ bgcolor: 'grey.50' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LightbulbIcon sx={{ fontSize: 18, color: 'info.main' }} />
                          提供されたアドバイス ({summary.advice.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {summary.advice.map((adv, index) => (
                            <Typography key={index} variant="body2">
                              • {adv}
                            </Typography>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* 気づき */}
                  {summary.insights.length > 0 && (
                    <Accordion elevation={0} sx={{ bgcolor: 'grey.50' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AssignmentIcon sx={{ fontSize: 18, color: 'success.main' }} />
                          気づき ({summary.insights.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {summary.insights.map((insight, index) => (
                            <Typography key={index} variant="body2">
                              • {insight}
                            </Typography>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  {/* 次のステップ */}
                  {summary.next_steps.length > 0 && (
                    <Accordion elevation={0} sx={{ bgcolor: 'grey.50' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingUpIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                          次のステップ ({summary.next_steps.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {summary.next_steps.map((step, index) => (
                            <Typography key={index} variant="body2">
                              • {step}
                            </Typography>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </MainLayout>
  );
};
