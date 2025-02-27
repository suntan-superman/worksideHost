import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
} from '@mui/icons-material';
import { useAnalyticsService } from '../../hooks/useAnalyticsService';

const TrendIndicator = ({ value, threshold = 0.05 }) => {
  if (Math.abs(value) < threshold) {
    return <TrendingFlat color="action" />;
  }
  return value > 0 ? (
    <TrendingUp color="success" />
  ) : (
    <TrendingDown color="error" />
  );
};

const EfficiencyInsights = () => {
  const { aggregatedData, isLoading } = useAnalyticsService();

  if (isLoading || !aggregatedData) {
    return <LinearProgress />;
  }

  const { efficiency } = aggregatedData;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Efficiency Insights
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">Overall Score</Typography>
            <Chip
              label={`${Math.round(efficiency.overall)}%`}
              color={efficiency.overall > 75 ? 'success' : 'warning'}
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={efficiency.overall}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {Object.entries(efficiency.breakdown).map(([key, data]) => (
          <Box key={key} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ flex: 1, textTransform: 'capitalize' }}>
                {key} Efficiency
              </Typography>
              <Tooltip title={`${data.trend > 0 ? '+' : ''}${data.trend.toFixed(1)}% change`}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendIndicator value={data.trend} />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {data.average.toFixed(1)}%
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
            {data.savings > 0 && (
              <Typography variant="caption" color="success.main">
                {data.savings.toFixed(1)}% savings compared to baseline
              </Typography>
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default EfficiencyInsights; 