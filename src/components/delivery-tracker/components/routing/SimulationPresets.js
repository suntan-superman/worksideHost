import React, { useState } from 'react';
import {
	Paper,
	Typography,
	Box,
	Button,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as ApplyIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const PresetDialog = ({ open, onClose, onSave, initialPreset = null }) => {
  const [name, setName] = useState(initialPreset?.name || '');
  const [description, setDescription] = useState(initialPreset?.description || '');

  const handleSave = () => {
    onSave({ name, description });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialPreset ? 'Edit Preset' : 'Save New Preset'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Preset Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!name.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SimulationPresets = ({ currentParams, onApplyPreset, onUpdatePreset }) => {
  const [presets, setPresets] = useState(() => {
    const savedPresets = localStorage.getItem('simulationPresets');
    return savedPresets ? JSON.parse(savedPresets) : [];
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState(null);

  const savePresets = (newPresets) => {
    setPresets(newPresets);
    localStorage.setItem('simulationPresets', JSON.stringify(newPresets));
  };

  const handleSavePreset = (presetData) => {
    const newPreset = {
      id: editingPreset?.id || Date.now(),
      ...presetData,
      params: currentParams,
      timestamp: new Date().toISOString(),
    };

    if (editingPreset) {
      savePresets(presets.map(p => p.id === editingPreset.id ? newPreset : p));
    } else {
      savePresets([...presets, newPreset]);
    }
    setEditingPreset(null);
  };

  const handleDeletePreset = (presetId) => {
    savePresets(presets.filter(p => p.id !== presetId));
  };

  const formatParamSummary = (params) => {
    const highlights = [
      params.weatherCondition,
      `${params.timeOfDay}:00`,
      params.useRealTimeTraffic ? 'Real-time' : 'Static',
    ];
    return highlights.join(' • ');
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Simulation Presets
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingPreset(null);
            setDialogOpen(true);
          }}
          size="small"
        >
          Save Current
        </Button>
      </Box>

      <List>
        {presets.map((preset) => (
          <ListItem
            key={preset.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemText
              primary={preset.name}
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {formatParamSummary(preset.params)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {preset.description}
                  </Typography>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Apply Preset">
                  <IconButton
                    size="small"
                    onClick={() => onApplyPreset(preset.params)}
                  >
                    <ApplyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingPreset(preset);
                      setDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => handleDeletePreset(preset.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <PresetDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingPreset(null);
        }}
        onSave={handleSavePreset}
        initialPreset={editingPreset}
      />
    </Paper>
  );
};

export default SimulationPresets; 