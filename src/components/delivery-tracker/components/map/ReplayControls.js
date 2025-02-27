import React from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Slider,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useDeliveryReplay } from '../../hooks/useDeliveryReplay';

const ReplayControls = () => {
  const { 
    isReplaying, 
    currentTime, 
    startReplay, 
    stopReplay,
    setCurrentTime 
  } = useDeliveryReplay();

  const formatTime = (ms) => {
    const date = new Date(ms);
    return date.toLocaleTimeString();
  };

  return (
    <Paper
      sx={{
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 1000,
        width: 400,
        display: isReplaying ? 'block' : 'none'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          Delivery Replay
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatTime(currentTime)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={isReplaying ? stopReplay : startReplay}
          color={isReplaying ? 'error' : 'primary'}
        >
          {isReplaying ? <Pause /> : <PlayArrow />}
        </IconButton>

        <IconButton onClick={stopReplay}>
          <Stop />
        </IconButton>

        <Slider
          value={currentTime}
          max={24 * 60 * 60 * 1000} // 24 hours
          onChange={(_, value) => setCurrentTime(value)}
          sx={{ flex: 1 }}
        />

        <Tooltip title="10x Speed">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SpeedIcon color="action" />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              10x
            </Typography>
          </Box>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default ReplayControls; 