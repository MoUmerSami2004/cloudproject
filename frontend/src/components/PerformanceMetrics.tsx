import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import axios from 'axios';

interface TransportMetric {
  line_id: string;
  line_name: string;
  status: string;
  delay_minutes: number;
  reliability_percentage: number;
  disruptions: number;
  congestion_level: number;
  timestamp: string;
}

const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<TransportMetric[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/metrics.json');
        const data = response.data;
        const metricsArray = Object.values(data) as TransportMetric[];
        setMetrics(metricsArray);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (metrics.length === 0) {
    return <Typography>Loading metrics...</Typography>;
  }

  // Calculate aggregate metrics
  const averageDelay = metrics.reduce((sum, m) => sum + m.delay_minutes, 0) / metrics.length;
  const averageReliability = metrics.reduce((sum, m) => sum + m.reliability_percentage, 0) / metrics.length;
  const totalDisruptions = metrics.reduce((sum, m) => sum + m.disruptions, 0);
  const averageCongestion = metrics.reduce((sum, m) => sum + m.congestion_level, 0) / metrics.length;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Performance Metrics
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Average Delay
          </Typography>
          <Typography variant="h4">
            {averageDelay.toFixed(1)} min
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Reliability
          </Typography>
          <Typography variant="h4">
            {averageReliability.toFixed(1)}%
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Total Disruptions
          </Typography>
          <Typography variant="h4">
            {totalDisruptions}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Average Congestion
          </Typography>
          <Typography variant="h4">
            {averageCongestion.toFixed(1)}%
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="textSecondary">
            Last updated: {new Date(metrics[0].timestamp).toLocaleTimeString()}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerformanceMetrics; 