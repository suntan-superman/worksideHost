import React from 'react';
import {
  Typography,
  Box,
  List,
  ListItem,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useDeliveryEstimates } from '../../hooks/useDeliveryEstimates';
import DraggableDialog from '../common/DraggableDialog';

const DeliveryEstimatesPanel = () => {
  const estimates = useDeliveryEstimates();

  return (
    <DraggableDialog
      dialogId="deliveryEstimates"
      title="Delivery Estimates"
    >
      <Box>
        <List>
          {estimates.map((estimate) => (
            <ListItem key={estimate.vehicleId}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimeIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">
                    ETA: {estimate.eta}
                  </Typography>
                  <Chip
                    size="small"
                    label={estimate.status}
                    color={estimate.status === 'on-time' ? 'success' : 'warning'}
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {estimate.destination}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                    {estimate.estimatedMinutes} mins remaining
                  </Typography>
                  <Tooltip title="Estimated based on average speed and current traffic conditions">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </DraggableDialog>
  );
};

export default DeliveryEstimatesPanel; 