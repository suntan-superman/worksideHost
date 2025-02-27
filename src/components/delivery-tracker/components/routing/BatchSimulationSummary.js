import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

const BatchSimulationSummary = ({ results }) => {
  const calculateAverages = () => {
    const validResults = results.filter(r => !r.error);
    if (validResults.length === 0) return null;

    return {
      reliability: validResults.reduce((sum, r) => sum + r.metrics.reliability, 0) / validResults.length,
      speed: validResults.reduce((sum, r) => sum + r.metrics.averageSpeed, 0) / validResults.length,
      risk: validResults.reduce((sum, r) => sum + r.metrics.riskLevel, 0) / validResults.length,
    };
  };

  const findBestAndWorst = () => {
    const validResults = results.filter(r => !r.error);
    if (validResults.length === 0) return null;

    return {
      best: validResults.reduce((best, current) => 
        current.metrics.reliability > best.metrics.reliability ? current : best
      ),
      worst: validResults.reduce((worst, current) => 
        current.metrics.reliability < worst.metrics.reliability ? current : worst
      ),
    };
  };

  const averages = calculateAverages();
  const comparison = findBestAndWorst();

  if (!averages || !comparison) return null;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Batch Simulation Summary
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Average Performance
          </Typography>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Reliability</TableCell>
                <TableCell align="right">
                  {(averages.reliability * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Average Speed</TableCell>
                <TableCell align="right">
                  {Math.round(averages.speed)} km/h
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Risk Level</TableCell>
                <TableCell align="right">
                  {(averages.risk * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Best Configuration
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                size="small"
                icon={<TrendingUpIcon />}
                label={comparison.best.params.weatherCondition}
                color="success"
              />
              <Chip
                size="small"
                label={`${comparison.best.params.timeOfDay}:00`}
                color="success"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Reliability: {(comparison.best.metrics.reliability * 100).toFixed(1)}%
            </Typography>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Worst Configuration
          </Typography>
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                size="small"
                icon={<TrendingDownIcon />}
                label={comparison.worst.params.weatherCondition}
                color="error"
              />
              <Chip
                size="small"
                label={`${comparison.worst.params.timeOfDay}:00`}
                color="error"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Reliability: {(comparison.worst.metrics.reliability * 100).toFixed(1)}%
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BatchSimulationSummary; 