import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Numbers,
  CheckCircle,
  Schedule,
  Block,
  Warning,
} from '@mui/icons-material';
import { DashboardStats } from '../../types';
import { dashboardAPI } from '../../services/api';
import AllocationChart from './AllocationChart';
import InventoryPieChart from './InventoryPieChart';
import ServiceTypeChart from './ServiceTypeChart';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getSummary();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        setError('Error loading dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !stats) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Failed to load dashboard data'}</Alert>
      </Container>
    );
  }

  const statCards = [
    {
      title: 'Total Numbers',
      value: stats.totalNumbers.toLocaleString(),
      icon: <Numbers />,
      color: 'primary',
      trend: '+5.2%',
    },
    {
      title: 'Available',
      value: stats.availableNumbers.toLocaleString(),
      icon: <CheckCircle />,
      color: 'success',
      trend: '-2.1%',
    },
    {
      title: 'Allocated',
      value: stats.allocatedNumbers.toLocaleString(),
      icon: <TrendingUp />,
      color: 'info',
      trend: '+12.3%',
    },
    {
      title: 'Reserved',
      value: stats.reservedNumbers.toLocaleString(),
      icon: <Schedule />,
      color: 'warning',
      trend: '+3.4%',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${
                  stat.color === 'primary' ? '#1976d2' :
                  stat.color === 'success' ? '#2e7d32' :
                  stat.color === 'info' ? '#0288d1' :
                  '#ed6c02'
                } 0%, ${
                  stat.color === 'primary' ? '#42a5f5' :
                  stat.color === 'success' ? '#66bb6a' :
                  stat.color === 'info' ? '#29b6f6' :
                  '#ff9800'
                } 100%)`,
                color: 'white',
                height: '140px',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ opacity: 0.8 }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 48 } })}
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                  {stat.trend} from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Allocation Trends Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Monthly Allocation Trends
            </Typography>
            <AllocationChart />
          </Paper>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Status Distribution
            </Typography>
            <InventoryPieChart data={stats} />
          </Paper>
        </Grid>

        {/* Service Type Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '350px' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Service Type Distribution
            </Typography>
            <ServiceTypeChart />
          </Paper>
        </Grid>

        {/* Recent Activity Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '350px' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Stats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Block color="error" />
                  <Typography variant="body1">Quarantined Numbers</Typography>
                </Box>
                <Typography variant="h6" color="error.main" sx={{ fontWeight: 600 }}>
                  {stats.quarantinedNumbers}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Warning color="warning" />
                  <Typography variant="body1">Held Numbers</Typography>
                </Box>
                <Typography variant="h6" color="warning.main" sx={{ fontWeight: 600 }}>
                  {stats.heldNumbers}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp color="success" />
                  <Typography variant="body1">Utilization Rate</Typography>
                </Box>
                <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }}>
                  {((stats.allocatedNumbers / stats.totalNumbers) * 100).toFixed(1)}%
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;