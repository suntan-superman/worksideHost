import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  LocalShipping as DeliveryIcon,
  Timeline as MetricsIcon,
  Download as DownloadIcon,
  ArrowForward,
} from '@mui/icons-material';
import { useDeliveryAnalytics } from '../../hooks/useDeliveryAnalytics';
import DetailedAnalyticsView from './DetailedAnalyticsView';
import DraggableDialog from '../common/DraggableDialog';

const MetricCard = ({ title, value, icon, color, subtitle }) => (
  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      {icon}
      <Typography variant="h6" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" color={color}>
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Box>
);

const DeliveryAnalyticsDashboard = () => {
  const [showDetailedView, setShowDetailedView] = useState(false);
  const { analytics, realtimeMetrics } = useDeliveryAnalytics();

  return (
    <>
      <DraggableDialog
        dialogId="analytics"
        title="Delivery Analytics"
      >
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <MetricCard
                title="Efficiency"
                value={`${analytics.deliveryEfficiency}%`}
                icon={<SpeedIcon color="primary" />}
                color="primary.main"
                subtitle="Overall delivery efficiency"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MetricCard
                title="Active Deliveries"
                value={realtimeMetrics.inTransitDeliveries}
                icon={<DeliveryIcon color="secondary" />}
                color="secondary.main"
                subtitle="Currently in transit"
              />
            </Grid>
            <Grid item xs={12}>
              <MetricCard
                title="Performance"
                value={`${analytics.onTimeDeliveries}/${analytics.totalDeliveries}`}
                icon={<MetricsIcon color="success" />}
                color="success.main"
                subtitle="On-time deliveries"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={() => setShowDetailedView(true)}
              endIcon={<ArrowForward />}
            >
              View Detailed Analytics
            </Button>
          </Box>
        </Box>
      </DraggableDialog>

      <DetailedAnalyticsView
        open={showDetailedView}
        onClose={() => setShowDetailedView(false)}
      />
    </>
  );
};

export default DeliveryAnalyticsDashboard; 