import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Slider,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';

const weatherConditions = ['normal', 'rain', 'snow', 'cloudy'];
const timeSlots = [
  { label: 'Morning', value: 8 },
  { label: 'Noon', value: 12 },
  { label: 'Evening', value: 17 },
  { label: 'Night', value: 22 },
];

const SimulationBatchConfig = ({ onRunBatch, isRunning }) => {
  const [configs, setConfigs] = useState([{
    id: Date.now(),
    weatherCondition: 'normal',
    timeOfDay: 8,
    trafficMultiplier: 1,
    useRealTimeTraffic: true,
  }]);

  const [open, setOpen] = useState(false);

  const handleAddConfig = () => {
    setConfigs(prev => [...prev, {
      id: Date.now(),
      weatherCondition: 'normal',
      timeOfDay: 8,
      trafficMultiplier: 1,
      useRealTimeTraffic: true,
    }]);
  };

  const handleRemoveConfig = (id) => {
    setConfigs(prev => prev.filter(config => config.id !== id));
  };

  const handleConfigChange = (id, field, value) => {
    setConfigs(prev => prev.map(config => 
      config.id === id ? { ...config, [field]: value } : config
    ));
  };

  const handleRunBatch = () => {
    onRunBatch(configs);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<PlayIcon />}
        onClick={() => setOpen(true)}
        disabled={isRunning}
      >
        Run Batch Simulation
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Batch Simulation Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddConfig}
              disabled={configs.length >= 5}
            >
              Add Configuration
            </Button>
          </Box>

          <Grid container spacing={2}>
            {configs.map((config, index) => (
              <Grid item xs={12} key={config.id}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ flex: 1 }}>
                      Configuration {index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveConfig(config.id)}
                      disabled={configs.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography gutterBottom>Weather Condition</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {weatherConditions.map(condition => (
                          <Chip
                            key={condition}
                            label={condition}
                            onClick={() => handleConfigChange(config.id, 'weatherCondition', condition)}
                            color={config.weatherCondition === condition ? 'primary' : 'default'}
                            variant={config.weatherCondition === condition ? 'filled' : 'outlined'}
                          />
                        ))}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography gutterBottom>Time of Day</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {timeSlots.map(slot => (
                          <Chip
                            key={slot.value}
                            label={slot.label}
                            onClick={() => handleConfigChange(config.id, 'timeOfDay', slot.value)}
                            color={config.timeOfDay === slot.value ? 'primary' : 'default'}
                            variant={config.timeOfDay === slot.value ? 'filled' : 'outlined'}
                          />
                        ))}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography gutterBottom>Traffic Multiplier</Typography>
                      <Slider
                        value={config.trafficMultiplier}
                        onChange={(_, value) => handleConfigChange(config.id, 'trafficMultiplier', value)}
                        min={0.5}
                        max={2}
                        step={0.1}
                        marks={[
                          { value: 0.5, label: 'Light' },
                          { value: 1, label: 'Normal' },
                          { value: 2, label: 'Heavy' },
                        ]}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={config.useRealTimeTraffic}
                            onChange={(e) => handleConfigChange(config.id, 'useRealTimeTraffic', e.target.checked)}
                          />
                        }
                        label="Use Real-time Traffic Data"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleRunBatch}
            disabled={configs.length === 0}
          >
            Run Batch
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SimulationBatchConfig; 