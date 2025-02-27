import React, { useRef } from 'react';
import { Paper, IconButton, Box, CircularProgress } from '@mui/material';
import { Close as CloseIcon, DragIndicator as DragIcon } from '@mui/icons-material';
import { Rnd } from 'react-rnd';
import useDeliveryStore from '../../stores/deliveryStore';
import { DEFAULT_DIALOG_SETTINGS } from '../../constants/dialogIds';

const DraggableDialog = ({ 
  dialogId, 
  children, 
  title,
  minWidth = 200,
  minHeight = 200
}) => {
  const { dialogSettings, updateDialogSettings } = useDeliveryStore();
  const rndRef = useRef();

  // If store is not yet initialized, show loading or return null
  if (!dialogSettings) {
    return null;
  }

  // Get settings with fallback to defaults
  const settings = {
    ...DEFAULT_DIALOG_SETTINGS[dialogId],
    ...dialogSettings[dialogId]
  };

  if (!settings?.open) return null;

  return (
    <Rnd
      ref={rndRef}
      default={{
        x: settings.position?.x ?? DEFAULT_DIALOG_SETTINGS[dialogId].position.x,
        y: settings.position?.y ?? DEFAULT_DIALOG_SETTINGS[dialogId].position.y,
        width: settings.size?.width ?? DEFAULT_DIALOG_SETTINGS[dialogId].size.width,
        height: settings.size?.height ?? DEFAULT_DIALOG_SETTINGS[dialogId].size.height
      }}
      minWidth={minWidth}
      minHeight={minHeight}
      bounds="window"
      onDragStop={(e, d) => {
        updateDialogSettings(dialogId, {
          position: { x: d.x, y: d.y }
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateDialogSettings(dialogId, {
          position: position,
          size: {
            width: ref.style.width,
            height: ref.style.height
          }
        });
      }}
    >
      <Paper 
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            cursor: 'move'
          }}
          className="drag-handle"
        >
          <DragIcon sx={{ mr: 1 }} />
          {title}
          <Box sx={{ ml: 'auto' }}>
            <IconButton
              size="small"
              onClick={() => updateDialogSettings(dialogId, { open: false })}
              sx={{ color: 'inherit' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {children}
        </Box>
      </Paper>
    </Rnd>
  );
};

export default DraggableDialog; 