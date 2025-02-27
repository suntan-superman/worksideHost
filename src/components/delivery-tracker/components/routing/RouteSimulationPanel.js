import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Warning as WarningIcon,
  WbSunny as WeatherIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useRouteSimulation } from '../../hooks/useRouteSimulation';

const RouteSimulationPanel = ({ route }) => {
  const {
    results,
    isSimulating,
    error,
    params,
    runSimulation,
    updateParams
  } = useRouteSimulation(route);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleParamChange = (key, value) => {
    updateParams({ [key]: value });
  };

  const handleRunSimulation = async () => {
    await runSimulation();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'success';
      case 'acceptable': return 'warning';
      default: return 'error';
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Route Simulation
        </Typography>
        <Tooltip title="Run Simulation">
          <IconButton
            onClick={handleRunSimulation}
            disabled={isSimulating}
          >
            <PlayIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Weather Condition</InputLabel>
            <Select
              value={params.weatherCondition}
              onChange={(e) => handleParamChange('weatherCondition', e.target.value)}
              label="Weather Condition"
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="rain">Rain</MenuItem>
              <MenuItem value="snow">Snow</MenuItem>
              <MenuItem value="storm">Storm</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Vehicle Type</InputLabel>
            <Select
              value={params.vehicleType}
              onChange={(e) => handleParamChange('vehicleType', e.target.value)}
              label="Vehicle Type"
            >
              <MenuItem value="standard">Standard</MenuItem>
              <MenuItem value="heavy">Heavy</MenuItem>
              <MenuItem value="light">Light</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {showAdvanced && (
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Traffic Multiplier</Typography>
          <Slider
            value={params.trafficMultiplier}
            onChange={(_, value) => handleParamChange('trafficMultiplier', value)}
            min={0.5}
            max={2}
            step={0.1}
            valueLabelDisplay="auto"
            marks={[
              { value: 0.5, label: 'Light' },
              { value: 1, label: 'Normal' },
              { value: 2, label: 'Heavy' }
            ]}
          />
        </Box>
      )}

      {isSimulating ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : results && (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Simulation Results
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Chip
                  icon={<SpeedIcon />}
                  label={`${Math.round(results.metrics.averageSpeed)} km/h`}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Chip
                  icon={<WarningIcon />}
                  label={`${results.metrics.riskCount} risks`}
                  color={results.metrics.riskCount > 3 ? 'warning' : 'default'}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Risk Analysis
            </Typography>
            {results.analysis.riskAnalysis.map((risk, index) => (
              <Alert
                key={index}
                severity={risk.averageSeverity > 0.7 ? 'error' : 'warning'}
                sx={{ mb: 1 }}
              >
                {risk.description}
              </Alert>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default RouteSimulationPanel; 