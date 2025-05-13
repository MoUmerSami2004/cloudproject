import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<TransportMetric[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

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

  // Mock historical data for the chart
  useEffect(() => {
    const generateHistoricalData = () => {
      const data = [];
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i}:00`,
          delay: Math.random() * 20,
          reliability: Math.random() * 100,
        });
      }
      setHistoricalData(data);
    };

    generateHistoricalData();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Line Status
      </Typography>
      <List>
        {metrics.map((metric) => (
          <ListItem key={metric.line_id}>
            <ListItemText
              primary={metric.line_name}
              secondary={`Status: ${metric.status} | Delay: ${metric.delay_minutes} min | Reliability: ${metric.reliability_percentage.toFixed(1)}%`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Historical Performance
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="delay"
              stroke="#8884d8"
              name="Average Delay (min)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="reliability"
              stroke="#82ca9d"
              name="Reliability (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Dashboard; 