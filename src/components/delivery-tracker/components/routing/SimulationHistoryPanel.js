import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  CloudDownload as DownloadIcon,
  Compare as CompareIcon,
} from '@mui/icons-material';
import { useSimulationHistory } from '../../hooks/useSimulationHistory';
import { importSimulationResults } from '../../utils/simulationImport';
import { exportSimulationResults } from '../../utils/simulationExport';

const SimulationHistoryPanel = ({ onCompare }) => {
  const { history, addSimulation, removeSimulation, clearHistory } = useSimulationHistory();
  const [selectedSims, setSelectedSims] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await importSimulationResults(file);
      addSimulation(importedData);
    } catch (error) {
      console.error('Import failed:', error);
      // Here you might want to show an error notification
    }
  };

  const handleCompare = () => {
    if (selectedSims.length === 2) {
      onCompare(selectedSims[0], selectedSims[1]);
    }
  };

  const toggleSimSelection = (simId) => {
    setSelectedSims(prev => {
      if (prev.includes(simId)) {
        return prev.filter(id => id !== simId);
      }
      if (prev.length < 2) {
        return [...prev, simId];
      }
      return [prev[1], simId];
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Simulation History
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            id="import-simulation"
            onChange={handleImport}
          />
          <label htmlFor="import-simulation">
            <Tooltip title="Import Simulation">
              <IconButton component="span" size="small">
                <UploadIcon />
              </IconButton>
            </Tooltip>
          </label>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setConfirmClear(true)}
            disabled={history.length === 0}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      {selectedSims.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<CompareIcon />}
            onClick={handleCompare}
            disabled={selectedSims.length !== 2}
          >
            Compare Selected
          </Button>
        </Box>
      )}

      <List dense>
        {history.map((sim, index) => (
          <ListItem
            key={sim.id || index}
            selected={selectedSims.includes(sim.id)}
            onClick={() => toggleSimSelection(sim.id)}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemText
              primary={`Simulation ${index + 1}`}
              secondary={formatDate(sim.timestamp)}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                size="small"
                label={sim.params.weatherCondition}
                color={sim.metrics.reliability > 0.7 ? 'success' : 'warning'}
              />
              <ListItemSecondaryAction>
                <Tooltip title="Export">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportSimulationResults(sim);
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSimulation(sim.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog open={confirmClear} onClose={() => setConfirmClear(false)}>
        <DialogTitle>Clear Simulation History</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all simulation history? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClear(false)}>Cancel</Button>
          <Button
            onClick={() => {
              clearHistory();
              setConfirmClear(false);
            }}
            color="error"
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SimulationHistoryPanel; 