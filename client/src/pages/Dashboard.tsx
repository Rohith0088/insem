import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
} from '@mui/material';
import {
  School,
  Event,
  People,
  TrendingUp,
  CalendarToday,
  LocationOn,
  Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

interface Activity {
  _id: string;
  name: string;
  category: string;
  type: string;
  status: string;
  schedule: {
    day: string;
    time: string;
    location: string;
  };
}

interface Event {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  activity: {
    name: string;
    category: string;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myActivities, setMyActivities] = useState<Activity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    // In a real app, you would fetch this from the API
    setTimeout(() => {
      setMyActivities([
        {
          _id: '1',
          name: 'Basketball Club',
          category: 'sport',
          type: 'ongoing',
          status: 'active',
          schedule: {
            day: 'Tuesday',
            time: '4:00 PM',
            location: 'Gymnasium',
          },
        },
        {
          _id: '2',
          name: 'Debate Society',
          category: 'academic',
          type: 'ongoing',
          status: 'active',
          schedule: {
            day: 'Thursday',
            time: '3:30 PM',
            location: 'Room 201',
          },
        },
      ]);

      setUpcomingEvents([
        {
          _id: '1',
          title: 'Basketball Practice',
          date: '2024-01-15',
          startTime: '16:00',
          endTime: '18:00',
          location: 'Gymnasium',
          type: 'practice',
          activity: {
            name: 'Basketball Club',
            category: 'sport',
          },
        },
        {
          _id: '2',
          title: 'Debate Competition',
          date: '2024-01-20',
          startTime: '09:00',
          endTime: '17:00',
          location: 'Auditorium',
          type: 'competition',
          activity: {
            name: 'Debate Society',
            category: 'academic',
          },
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      sport: '#4caf50',
      academic: '#2196f3',
      cultural: '#9c27b0',
      volunteer: '#ff9800',
      club: '#607d8b',
    };
    return colors[category] || '#757575';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sport':
        return <People />;
      case 'academic':
        return <School />;
      case 'cultural':
        return <Event />;
      default:
        return <School />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's what's happening with your extracurricular activities.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <School />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {myActivities.length}
                  </Typography>
                  <Typography color="text.secondary">
                    My Activities
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <Event />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {upcomingEvents.length}
                  </Typography>
                  <Typography color="text.secondary">
                    Upcoming Events
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    85%
                  </Typography>
                  <Typography color="text.secondary">
                    Attendance Rate
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    3
                  </Typography>
                  <Typography color="text.secondary">
                    Achievements
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* My Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                My Activities
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/activities')}
              >
                View All
              </Button>
            </Box>
            {myActivities.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                You haven't joined any activities yet.
                <br />
                <Button
                  variant="text"
                  onClick={() => navigate('/activities')}
                  sx={{ mt: 1 }}
                >
                  Browse Activities
                </Button>
              </Typography>
            ) : (
              <List>
                {myActivities.map((activity) => (
                  <ListItem
                    key={activity._id}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: getCategoryColor(activity.category) }}>
                        {getCategoryIcon(activity.category)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.name}
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip
                              label={activity.category}
                              size="small"
                              sx={{ bgcolor: getCategoryColor(activity.category), color: 'white' }}
                            />
                            <Chip
                              label={activity.status}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule sx={{ fontSize: 16 }} />
                            <Typography variant="caption">
                              {activity.schedule.day} at {activity.schedule.time}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 16 }} />
                            <Typography variant="caption">
                              {activity.schedule.location}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Upcoming Events
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/events')}
              >
                View All
              </Button>
            </Box>
            {upcomingEvents.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                No upcoming events.
                <br />
                <Button
                  variant="text"
                  onClick={() => navigate('/events')}
                  sx={{ mt: 1 }}
                >
                  Browse Events
                </Button>
              </Typography>
            ) : (
              <List>
                {upcomingEvents.map((event) => (
                  <ListItem
                    key={event._id}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: getCategoryColor(event.activity.category) }}>
                        <Event />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip
                              label={event.activity.name}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={event.type}
                              size="small"
                              sx={{ bgcolor: getCategoryColor(event.activity.category), color: 'white' }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday sx={{ fontSize: 16 }} />
                            <Typography variant="caption">
                              {format(new Date(event.date), 'MMM dd, yyyy')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Schedule sx={{ fontSize: 16 }} />
                            <Typography variant="caption">
                              {event.startTime} - {event.endTime}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 16 }} />
                            <Typography variant="caption">
                              {event.location}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
