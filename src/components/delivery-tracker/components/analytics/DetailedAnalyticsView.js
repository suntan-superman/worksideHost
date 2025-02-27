import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  LinearProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDeliveryAnalytics } from '../../hooks/useDeliveryAnalytics';

const TabPanel = ({ children, value, index }) => (
  <Box sx={{ display: value === index ? 'block' : 'none', p: 3 }}>
    {children}
  </Box>
);

const DetailedAnalyticsView = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { analytics, realtimeMetrics, historicalData } = useDeliveryAnalytics();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>Detailed Analytics</DialogTitle>
      <DialogContent>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Performance" />
          <Tab label="Efficiency" />
          <Tab label="Trends" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Delivery Success Rate
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={historicalData?.deliverySuccess}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="success" fill="#4caf50" />
                      <Bar dataKey="failed" fill="#f44336" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Average Delivery Times
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Average
                    </Typography>
                    <Typography variant="h4">
                      {analytics.averageDeliveryTime} mins
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(analytics.averageDeliveryTime / 120) * 100}
                      sx={{ mt: 1, mb: 3 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Vehicle Utilization
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Active Vehicles
                    </Typography>
                    <Typography variant="h4">
                      {realtimeMetrics.activeVehicles}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(realtimeMetrics.activeVehicles / analytics.totalVehicles) * 100}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Fuel Efficiency
                  </Typography>
                  <Typography variant="h4">
                    {analytics.fuelEfficiency} mpg
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average across all vehicles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={historicalData?.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="deliveries" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Delivery volume by hour of day
          </Typography>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedAnalyticsView; 