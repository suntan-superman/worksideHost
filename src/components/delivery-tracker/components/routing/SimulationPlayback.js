import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Slider,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipNext as NextIcon,
  SkipPrevious as PrevIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

const SimulationPlayback = ({ segments, onSegmentChange, currentSegment = 0 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (playbackSpeed * 0.5);
          if (newProgress >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const segmentIndex = Math.floor((newProgress / 100) * segments.length);
          if (segmentIndex !== currentSegment) {
            onSegmentChange(segmentIndex);
          }
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, segments.length, currentSegment, onSegmentChange]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextSegment = Math.min(currentSegment + 1, segments.length - 1);
    onSegmentChange(nextSegment);
    setProgress((nextSegment / segments.length) * 100);
  };

  const handlePrev = () => {
    const prevSegment = Math.max(currentSegment - 1, 0);
    onSegmentChange(prevSegment);
    setProgress((prevSegment / segments.length) * 100);
  };

  const handleSpeedChange = () => {
    const speeds = [1, 2, 4];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          Simulation Playback
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={`${playbackSpeed}x Speed`}>
            <IconButton size="small" onClick={handleSpeedChange}>
              <SpeedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <IconButton onClick={handlePrev} disabled={currentSegment === 0}>
          <PrevIcon />
        </IconButton>
        <IconButton onClick={handlePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
        <IconButton onClick={handleNext} disabled={currentSegment === segments.length - 1}>
          <NextIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {formatTime(segments[currentSegment]?.simulatedDuration || 0)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Segment {currentSegment + 1} of {segments.length}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SimulationPlayback; 