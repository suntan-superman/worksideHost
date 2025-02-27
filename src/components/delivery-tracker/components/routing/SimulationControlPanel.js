import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Grid,
  Chip,
  Collapse,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  Speed as SpeedIcon,
  Settings as SettingsIcon,
  SaveAlt as SaveIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useRouteSimulation } from '../../hooks/useRouteSimulation';
import { useSimulationHistory } from '../../hooks/useSimulationHistory';
import SimulationMetricsDisplay from './SimulationMetricsDisplay';
import SimulationPlayback from './SimulationPlayback';
import SegmentDetailView from './SegmentDetailView';
import WeatherImpactAnalysis from './WeatherImpactAnalysis';
import SimulationComparisonChart from './SimulationComparisonChart';
import SimulationHistoryPanel from './SimulationHistoryPanel';
import SimulationBatchConfig from './SimulationBatchConfig';
import { exportSimulationResults } from '../../utils/simulationExport';
import BatchSimulationProgress from './BatchSimulationProgress';
import BatchSimulationSummary from './BatchSimulationSummary';
import SimulationRecommendations from './SimulationRecommendations';
import SimulationComparisonDialog from './SimulationComparisonDialog';
import SimulationInsights from './SimulationInsights';
import SimulationPresets from './SimulationPresets';

const SimulationControlPanel = ({ route }) => {
  const {
    results,
    isSimulating,
    params,
    updateParams,
    runSimulation,
    stopSimulation,
    pauseSimulation,
  } = useRouteSimulation(route);

  const { addSimulation, history } = useSimulationHistory();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [batchState, setBatchState] = useState({
    isRunning: false,
    configs: [],
    results: [],
    progress: {
      completed: 0,
      errors: 0
    }
  });
  const [comparisonState, setComparisonState] = useState({
    open: false,
    simulation1: null,
    simulation2: null
  });

  const handleStart = async () => {
    const simResults = await runSimulation();
    if (simResults) {
      addSimulation(simResults, params);
    }
  };

  const handleSpeedChange = (speed) => {
    setSimSpeed(speed);
    updateParams({ simulationSpeed: speed });
  };

  const getStatusColor = () => {
    if (!results) return 'default';
    if (results.metrics.reliability > 0.8) return 'success';
    if (results.metrics.reliability > 0.6) return 'warning';
    return 'error';
  };

  const handleExport = () => {
    if (results) {
      exportSimulationResults({
        timestamp: new Date(),
        params,
        ...results,
      });
    }
  };

  const handleBatchProgress = (index, progress) => {
    setBatchState(prev => ({
      ...prev,
      results: prev.results.map((result, i) => 
        i === index ? { ...result, progress } : result
      )
    }));
  };

  const handleBatchSimulation = async (configs) => {
    setBatchState({
      isRunning: true,
      configs,
      results: configs.map(() => null),
      progress: { completed: 0, errors: 0 }
    });

    for (let i = 0; i < configs.length; i++) {
      try {
        const simResults = await runSimulation({
          ...configs[i],
          onProgress: (progress) => handleBatchProgress(i, progress)
        });

        setBatchState(prev => ({
          ...prev,
          results: prev.results.map((r, index) => 
            index === i ? simResults : r
          ),
          progress: {
            ...prev.progress,
            completed: prev.progress.completed + 1
          }
        }));

        if (simResults) {
          addSimulation(simResults, configs[i]);
        }
      } catch (error) {
        console.error(`Batch simulation ${i + 1} failed:`, error);
        setBatchState(prev => ({
          ...prev,
          results: prev.results.map((r, index) => 
            index === i ? { error: true } : r
          ),
          progress: {
            ...prev.progress,
            completed: prev.progress.completed + 1,
            errors: prev.progress.errors + 1
          }
        }));
      }
    }

    setBatchState(prev => ({
      ...prev,
      isRunning: false
    }));
  };

  const handleApplyRecommendation = async (type) => {
    switch (type) {
      case 'time':
        // Optimize departure time
        const optimalTime = results.analysis.recommendations
          .find(r => r.type === 'timing')?.optimalTime || 8;
        await runSimulation({ timeOfDay: optimalTime });
        break;
      case 'route':
        // Apply alternative route
        const alternativeRoute = results.analysis.recommendations
          .find(r => r.type === 'route')?.alternative;
        if (alternativeRoute) {
          // Handle route change
        }
        break;
      case 'risk':
        // Apply safety-optimized route
        await runSimulation({
          weatherCondition: results.weatherData.condition,
          prioritizeSafety: true
        });
        break;
      case 'performance':
        // Apply performance optimization
        await runSimulation({
          optimizeFor: 'reliability',
          useHistoricalData: true
        });
        break;
      default:
        break;
    }
  };

  const handleCompareSimulations = (sim1, sim2) => {
    setComparisonState({
      open: true,
      simulation1: sim1,
      simulation2: sim2
    });
  };

  const handleApplyPreset = (presetParams) => {
    updateParams(presetParams);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Simulation Control
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="History">
            <IconButton
              size="small"
              onClick={() => setShowHistory(!showHistory)}
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          {results && (
            <Tooltip title="Export Results">
              <IconButton size="small" onClick={handleExport}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Simulation Settings">
            <IconButton
              size="small"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={`${simSpeed}x Speed`}>
            <IconButton
              size="small"
              onClick={() => handleSpeedChange(simSpeed === 1 ? 2 : 1)}
            >
              <SpeedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              startIcon={isSimulating ? <PauseIcon /> : <PlayIcon />}
              onClick={isSimulating ? pauseSimulation : handleStart}
              color="primary"
              disabled={batchState.isRunning}
            >
              {isSimulating ? 'Pause' : 'Start'}
            </Button>
          </Grid>
          <Grid item>
            <SimulationBatchConfig
              onRunBatch={handleBatchSimulation}
              isRunning={isSimulating || batchState.isRunning}
            />
          </Grid>
          {isSimulating && (
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<StopIcon />}
                onClick={stopSimulation}
                color="error"
              >
                Stop
              </Button>
            </Grid>
          )}
          <Grid item xs>
            {isSimulating && (
              <LinearProgress
                variant="determinate"
                value={results?.progress || 0}
                sx={{ height: 8, borderRadius: 4 }}
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {results && (
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                size="small"
                label={results.analysis.summary.status}
                color={getStatusColor()}
                sx={{ mt: 0.5 }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Confidence
              </Typography>
              <Typography variant="body1">
                {Math.round(results.confidence * 100)}%
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {results && (
        <>
          <Box sx={{ mt: 3 }}>
            <SimulationMetricsDisplay
              metrics={results.metrics}
              isLive={isSimulating}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <SimulationPlayback
              segments={results.segments}
              currentSegment={currentSegment}
              onSegmentChange={setCurrentSegment}
            />
          </Box>
          <Box sx={{ mt: 3 }}>
            <SegmentDetailView
              segment={results.segments[currentSegment]}
              index={currentSegment}
              totalSegments={results.segments.length}
            />
          </Box>
          {results.weatherData && (
            <Box sx={{ mt: 3 }}>
              <WeatherImpactAnalysis
                weatherData={results.weatherData}
                metrics={results.metrics}
              />
            </Box>
          )}
          {history.length > 1 && (
            <Box sx={{ mt: 3 }}>
              <SimulationComparisonChart simulations={history} />
            </Box>
          )}
          <Box sx={{ mt: 3 }}>
            <SimulationRecommendations
              results={results}
              onApplyRecommendation={handleApplyRecommendation}
            />
          </Box>
          {history.length >= 2 && (
            <Box sx={{ mt: 3 }}>
              <SimulationInsights history={history} />
            </Box>
          )}
        </>
      )}

      {batchState.isRunning && (
        <Box sx={{ mt: 3 }}>
          <BatchSimulationProgress
            configs={batchState.configs}
            progress={batchState.progress}
            results={batchState.results}
          />
        </Box>
      )}

      {!batchState.isRunning && batchState.results.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <BatchSimulationSummary results={batchState.results} />
        </Box>
      )}

      <Collapse in={showHistory}>
        <Box sx={{ mt: 2 }}>
          <SimulationHistoryPanel
            onCompare={handleCompareSimulations}
          />
        </Box>
      </Collapse>

      <SimulationComparisonDialog
        open={comparisonState.open}
        onClose={() => setComparisonState(prev => ({ ...prev, open: false }))}
        simulation1={comparisonState.simulation1}
        simulation2={comparisonState.simulation2}
      />

      <Collapse in={showAdvanced}>
        <Box sx={{ mt: 2 }}>
          <SimulationPresets
            currentParams={params}
            onApplyPreset={handleApplyPreset}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Advanced Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={params.useRealTimeTraffic}
                  onChange={(e) => updateParams({ useRealTimeTraffic: e.target.checked })}
                  size="small"
                />
              }
              label="Real-time Traffic"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={params.considerWeather}
                  onChange={(e) => updateParams({ considerWeather: e.target.checked })}
                  size="small"
                />
              }
              label="Weather Impact"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={params.dynamicReoptimization}
                  onChange={(e) => updateParams({ dynamicReoptimization: e.target.checked })}
                  size="small"
                />
              }
              label="Dynamic Re-optimization"
            />
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default SimulationControlPanel; 