import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Paper,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  People,
  School,
  Event,
  TrendingUp,
  Notifications,
  CheckCircle,
  Pending,
  Cancel,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  change?: string;
}

interface RecentActivity {
  id: string;
  type: 'registration' | 'event' | 'activity';
  message: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats([
        {
          title: 'Total Students',
          value: 1247,
          icon: <People />,
          color: '#1976d2',
          change: '+12%',
        },
        {
          title: 'Active Activities',
          value: 28,
          icon: <School />,
          color: '#388e3c',
          change: '+3',
        },
        {
          title: 'Upcoming Events',
          value: 15,
          icon: <Event />,
          color: '#f57c00',
          change: '+5',
        },
        {
          title: 'Pending Registrations',
          value: 23,
          icon: <Pending />,
          color: '#9c27b0',
          change: '-8',
        },
      ]);

      setRecentActivities([
        {
          id: '1',
          type: 'registration',
          message: 'John Doe registered for Basketball Club',
          timestamp: '2 minutes ago',
          status: 'success',
        },
        {
          id: '2',
          type: 'event',
          message: 'New event created: Debate Competition',
          timestamp: '15 minutes ago',
          status: 'success',
        },
        {
          id: '3',
          type: 'activity',
          message: 'Art Club registration is pending approval',
          timestamp: '1 hour ago',
          status: 'pending',
        },
        {
          id: '4',
          type: 'registration',
          message: 'Sarah Wilson withdrew from Soccer Team',
          timestamp: '2 hours ago',
          status: 'error',
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Pending color="warning" />;
      case 'error':
        return <Cancel color="error" />;
      default:
        return <Notifications />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Overview of extracurricular activities and student participation.
        </Typography>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="div">
                      {stat.value.toLocaleString()}
                    </Typography>
                    <Typography color="text.secondary">
                      {stat.title}
                    </Typography>
                    {stat.change && (
                      <Typography
                        variant="caption"
                        color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                      >
                        {stat.change} from last month
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/admin/activities')}
                startIcon={<School />}
              >
                Manage Activities
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/admin/events')}
                startIcon={<Event />}
              >
                Manage Events
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/admin/registrations')}
                startIcon={<Pending />}
              >
                Review Registrations
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/admin/users')}
                startIcon={<People />}
              >
                Manage Users
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Activities
              </Typography>
              <Button size="small" onClick={() => navigate('/admin/registrations')}>
                View All
              </Button>
            </Box>
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'grey.100' }}>
                      {getStatusIcon(activity.status)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={activity.message}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={activity.type}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {activity.timestamp}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Activity Categories Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activity Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { name: 'Sports', count: 8, percentage: 75 },
                { name: 'Academic', count: 6, percentage: 60 },
                { name: 'Cultural', count: 4, percentage: 80 },
                { name: 'Volunteer', count: 3, percentage: 45 },
                { name: 'Other', count: 7, percentage: 55 },
              ].map((category) => (
                <Box key={category.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{category.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.count} activities
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={category.percentage}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Database</Typography>
                <Chip label="Online" color="success" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Email Service</Typography>
                <Chip label="Online" color="success" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">File Storage</Typography>
                <Chip label="Online" color="success" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Backup</Typography>
                <Chip label="Last: 2 hours ago" color="info" size="small" />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
