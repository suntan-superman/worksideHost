import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowUpward as ImprovedIcon,
  ArrowDownward as DegradeIcon,
  Remove as UnchangedIcon,
} from '@mui/icons-material';

const MetricComparison = ({ label, value1, value2, unit = '', isPercentage = false }) => {
  const difference = value2 - value1;
  const percentChange = ((value2 - value1) / value1) * 100;
  
  const getChangeIcon = () => {
    if (Math.abs(percentChange) < 1) return <UnchangedIcon color="disabled" />;
    return percentChange > 0 ? 
      <ImprovedIcon color="success" /> : 
      <DegradeIcon color="error" />;
  };

  const formatValue = (value) => {
    if (isPercentage) {
      return `${(value * 100).toFixed(1)}%`;
    }
    return `${value.toFixed(1)}${unit}`;
  };

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell align="right">{formatValue(value1)}</TableCell>
      <TableCell align="right">{formatValue(value2)}</TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
          {getChangeIcon()}
          <Tooltip title={`${Math.abs(percentChange).toFixed(1)}% ${percentChange > 0 ? 'improvement' : 'decrease'}`}>
            <Typography variant="body2" color={percentChange > 0 ? 'success.main' : 'error.main'}>
              {difference > 0 ? '+' : ''}{formatValue(difference)}
            </Typography>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const SimulationComparisonDialog = ({ open, onClose, simulation1, simulation2 }) => {
  if (!simulation1 || !simulation2) return null;

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getParamDifferences = () => {
    const differences = [];
    for (const key in simulation1.params) {
      if (simulation1.params[key] !== simulation2.params[key]) {
        differences.push({
          param: key,
          value1: simulation1.params[key],
          value2: simulation2.params[key],
        });
      }
    }
    return differences;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Simulation Comparison
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Configuration Differences
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {getParamDifferences().map(diff => (
                <Chip
                  key={diff.param}
                  label={`${diff.param}: ${diff.value1} → ${diff.value2}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Metrics Comparison
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell align="right">
                    Simulation 1
                    <Typography variant="caption" display="block" color="text.secondary">
                      {formatDateTime(simulation1.timestamp)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    Simulation 2
                    <Typography variant="caption" display="block" color="text.secondary">
                      {formatDateTime(simulation2.timestamp)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <MetricComparison
                  label="Reliability"
                  value1={simulation1.metrics.reliability}
                  value2={simulation2.metrics.reliability}
                  isPercentage
                />
                <MetricComparison
                  label="Average Speed"
                  value1={simulation1.metrics.averageSpeed}
                  value2={simulation2.metrics.averageSpeed}
                  unit=" km/h"
                />
                <MetricComparison
                  label="Risk Level"
                  value1={simulation1.metrics.riskLevel}
                  value2={simulation2.metrics.riskLevel}
                  isPercentage
                />
                <MetricComparison
                  label="Time Efficiency"
                  value1={simulation1.metrics.timeEfficiency}
                  value2={simulation2.metrics.timeEfficiency}
                  isPercentage
                />
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SimulationComparisonDialog; 