import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Schedule as TimeIcon,
  Route as RouteIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

const RecommendationItem = ({ icon, title, description, impact, action, onAction }) => (
  <ListItem>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText
      primary={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {title}
          <Chip
            size="small"
            label={`${impact}% improvement`}
            color={impact > 15 ? 'success' : 'primary'}
          />
        </Box>
      }
      secondary={description}
    />
    {action && (
      <Button
        size="small"
        variant="outlined"
        onClick={onAction}
        sx={{ ml: 2 }}
      >
        {action}
      </Button>
    )}
  </ListItem>
);

const SimulationRecommendations = ({ results, onApplyRecommendation }) => {
  if (!results) return null;

  const { metrics, analysis } = results;
  const recommendations = [];

  // Generate time-based recommendations
  if (metrics.timeEfficiency < 0.7) {
    recommendations.push({
      icon: <TimeIcon color="primary" />,
      title: 'Optimize Departure Time',
      description: 'Shifting departure time could reduce travel time by avoiding peak traffic hours',
      impact: 20,
      action: 'Adjust Time',
      type: 'time',
    });
  }

  // Route optimization recommendations
  if (metrics.routeComplexity > 0.6) {
    recommendations.push({
      icon: <RouteIcon color="primary" />,
      title: 'Simplify Route',
      description: 'Alternative route available with fewer complex intersections',
      impact: 15,
      action: 'View Alternative',
      type: 'route',
    });
  }

  // Risk-based recommendations
  if (metrics.riskLevel > 0.4) {
    recommendations.push({
      icon: <WarningIcon color="warning" />,
      title: 'Risk Mitigation',
      description: 'Consider weather-optimized route to reduce risk factors',
      impact: 25,
      action: 'Apply Safety Route',
      type: 'risk',
    });
  }

  // Performance optimization
  if (metrics.reliability < 0.8) {
    recommendations.push({
      icon: <SpeedIcon color="primary" />,
      title: 'Performance Optimization',
      description: 'Route can be optimized for better reliability and consistency',
      impact: 18,
      action: 'Optimize',
      type: 'performance',
    });
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Recommendations
        </Typography>
        <Tooltip title="Based on simulation results and historical data">
          <Chip
            icon={<TrendingIcon />}
            label={`${recommendations.length} suggestions`}
            size="small"
            color="primary"
          />
        </Tooltip>
      </Box>

      {recommendations.length > 0 ? (
        <List>
          {recommendations.map((rec, index) => (
            <React.Fragment key={rec.type}>
              <RecommendationItem
                {...rec}
                onAction={() => onApplyRecommendation(rec.type)}
              />
              {index < recommendations.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
          <CheckIcon color="success" />
          <Typography>Route is already optimized</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SimulationRecommendations; 