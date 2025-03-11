import React from 'react';
import { Paper, Typography, Box, Tooltip } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
} from '@mui/lab';
import {
  Schedule as TimeIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  DirectionsCar as CarIcon,
  Traffic as TrafficIcon,
} from '@mui/icons-material';

const SimulationTimeline = ({ segments }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getSegmentIcon = (segment) => {
    if (segment.riskFactors.length > 1) return <WarningIcon color="error" />;
    if (segment.riskFactors.length === 1) return <WarningIcon color="warning" />;
    if (segment.trafficDensity > 1.5) return <TrafficIcon color="error" />;
    if (segment.trafficDensity > 1.2) return <TrafficIcon color="warning" />;
    return <CheckIcon color="success" />;
  };

  const getSegmentColor = (segment) => {
    if (segment.riskFactors.length > 1) return 'error.main';
    if (segment.riskFactors.length === 1) return 'warning.main';
    if (segment.trafficDensity > 1.5) return 'error.main';
    if (segment.trafficDensity > 1.2) return 'warning.main';
    return 'success.main';
  };

  const renderInstruction = (instruction) => {
    // Convert HTML instruction to plain text
    const div = document.createElement('div');
    div.innerHTML = instruction;
    return div.textContent || div.innerText || '';
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TimeIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          Route Timeline
        </Typography>
      </Box>

      <Timeline position="right">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <CarIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="subtitle2">Start</Typography>
            <Typography variant="body2" color="text.secondary">
              Initial departure
            </Typography>
          </TimelineContent>
        </TimelineItem>

        {segments.map((segment) => (
          <TimelineItem key={`${segment.id || segment.instruction}`}>
            <TimelineSeparator>
              <TimelineDot sx={{ bgcolor: getSegmentColor(segment) }}>
                {getSegmentIcon(segment)}
              </TimelineDot>
              {index < segments.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">
                    Segment {index + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(segment.simulatedDuration)}
                  </Typography>
                </Box>
                {segment.riskFactors.length > 0 && (
                  <Tooltip
                    title={
                      <Box>
                        {segment.riskFactors.map((risk) => (
                          <Typography key={risk.type + risk.severity} variant="body2">
                            {risk.description}
                          </Typography>
                        ))}
                      </Box>
                    }
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WarningIcon
                        color={segment.riskFactors.length > 1 ? 'error' : 'warning'}
                        fontSize="small"
                      />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {segment.riskFactors.length} risks
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
              </Box>
              <Typography variant="body2">
                {renderInstruction(segment.instruction)}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}

        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <CheckIcon />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="subtitle2">Destination</Typography>
            <Typography variant="body2" color="text.secondary">
              Estimated arrival
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Paper>
  );
};

export default SimulationTimeline; 