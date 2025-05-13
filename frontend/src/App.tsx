import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Dashboard from './components/Dashboard';
import Map from './components/Map';
import PerformanceMetrics from './components/PerformanceMetrics';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" component="h1">
                Public Transport Performance Dashboard
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: '600px' }}>
              <Map />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <PerformanceMetrics />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Dashboard />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App; 
