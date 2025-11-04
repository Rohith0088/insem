import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CalendarToday,
  Schedule,
  LocationOn,
  People,
  Person,
  Email,
  School,
  Sports,
  Group,
  Palette,
  Build,
  MoreVert,
  CheckCircle,
  Pending,
  Cancel,
  AttachMoney,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface EventDetails {
  _id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  status: string;
  activity: {
    name: string;
    category: string;
    description: string;
  };
  organizer: {
    name: string;
    email: string;
    phone: string;
  };
  attendeeCount: number;
  requirements: {
    registrationRequired: boolean;
    registrationDeadline: string;
    dressCode: string;
    equipment: string[];
    cost: number;
  };
  attendees: Array<{
    user: {
      name: string;
      email: string;
    };
    registeredAt: string;
    attendance: string;
  }>;
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEvent: EventDetails = {
        _id: id || '1',
        title: 'Basketball Practice',
        description: 'Weekly basketball practice session focusing on fundamental skills and team coordination. We will work on shooting techniques, defensive strategies, and team plays. All skill levels are welcome to participate.',
        type: 'practice',
        date: '2024-01-15',
        startTime: '16:00',
        endTime: '18:00',
        location: 'Gymnasium',
        capacity: 20,
        status: 'scheduled',
        activity: {
          name: 'Basketball Club',
          category: 'sport',
          description: 'Join our basketball club for weekly practices and tournaments.',
        },
        organizer: {
          name: 'Coach Johnson',
          email: 'coach.johnson@school.edu',
          phone: '+1 (555) 123-4567',
        },
        attendeeCount: 15,
        requirements: {
          registrationRequired: false,
          registrationDeadline: '',
          dressCode: 'Athletic clothing and basketball shoes',
          equipment: ['Basketball', 'Water bottle'],
          cost: 0,
        },
        attendees: [
          {
            user: { name: 'John Doe', email: 'john.doe@school.edu' },
            registeredAt: '2024-01-10',
            attendance: 'registered',
          },
          {
            user: { name: 'Jane Smith', email: 'jane.smith@school.edu' },
            registeredAt: '2024-01-11',
            attendance: 'registered',
          },
        ],
      };

      setEvent(mockEvent);
      setIsRegistered(true); // Mock: user is registered
      setIsAttending(true); // Mock: user is attending
      setError('');
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      sport: '#4caf50',
      academic: '#2196f3',
      cultural: '#9c27b0',
      volunteer: '#ff9800',
      club: '#607d8b',
      other: '#757575',
    };
    return colors[category] || '#757575';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sport':
        return <Sports />;
      case 'academic':
        return <School />;
      case 'cultural':
        return <Palette />;
      case 'volunteer':
        return <Group />;
      case 'club':
        return <Group />;
      default:
        return <MoreVert />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'ongoing':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'practice':
        return 'info';
      case 'competition':
        return 'warning';
      case 'meeting':
        return 'primary';
      case 'social':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleRegister = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully registered for the event!');
      setIsRegistered(true);
    } catch (error) {
      toast.error('Failed to register for event');
    }
  };

  const handleUnregister = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Unregistered from the event');
      setIsRegistered(false);
      setIsAttending(false);
    } catch (error) {
      toast.error('Failed to unregister from event');
    }
  };

  const isEventUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  const isRegistrationOpen = () => {
    if (!event) return false;
    if (!event.requirements.registrationRequired) return true;
    if (!event.requirements.registrationDeadline) return true;
    return new Date(event.requirements.registrationDeadline) > new Date();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Event not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/events')}
          sx={{ mb: 2 }}
        >
          ← Back to Events
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Event Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: getCategoryColor(event.activity.category),
                    mr: 2,
                    width: 60,
                    height: 60,
                  }}
                >
                  {getCategoryIcon(event.activity.category)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={event.activity.category}
                      sx={{
                        bgcolor: getCategoryColor(event.activity.category),
                        color: 'white',
                      }}
                    />
                    <Chip
                      label={event.type}
                      color={getTypeColor(event.type) as any}
                      variant="outlined"
                    />
                    <Chip
                      label={event.status}
                      color={getStatusColor(event.status) as any}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Event Details */}
              <Typography variant="h6" gutterBottom>
                Event Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Time
                      </Typography>
                      <Typography variant="body1">
                        {event.startTime} - {event.endTime}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {event.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Capacity
                      </Typography>
                      <Typography variant="body1">
                        {event.attendeeCount} / {event.capacity} attendees
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Requirements */}
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {event.requirements.cost > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoney color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Cost
                        </Typography>
                        <Typography variant="body1">
                          ${event.requirements.cost}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {event.requirements.dressCode && (
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Dress Code
                      </Typography>
                      <Typography variant="body1">
                        {event.requirements.dressCode}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {event.requirements.equipment.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Required Equipment
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {event.requirements.equipment.map((item) => (
                        <Chip key={item} label={item} size="small" color="info" variant="outlined" />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Activity Info */}
              <Typography variant="h6" gutterBottom>
                Related Activity
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  {event.activity.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.activity.description}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Organizer Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Organizer
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>
                  {event.organizer.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    {event.organizer.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Event Organizer
                  </Typography>
                </Box>
              </Box>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary={event.organizer.email}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary={event.organizer.phone}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Registration Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Registration
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h4" component="span">
                    {event.attendeeCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / {event.capacity} attendees
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Registration Required: {event.requirements.registrationRequired ? 'Yes' : 'No'}
              </Typography>
              {event.requirements.registrationDeadline && (
                <Typography variant="body2" color="text.secondary">
                  Deadline: {format(new Date(event.requirements.registrationDeadline), 'MMM dd, yyyy')}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent>
              {user ? (
                isRegistered ? (
                  <Box>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      You are registered for this event
                    </Alert>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={handleUnregister}
                      disabled={!isEventUpcoming(event.date)}
                    >
                      Unregister
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleRegister}
                      disabled={
                        !isEventUpcoming(event.date) ||
                        !isRegistrationOpen() ||
                        event.attendeeCount >= event.capacity
                      }
                    >
                      Register for Event
                    </Button>
                    {!isEventUpcoming(event.date) && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        This event has already passed
                      </Alert>
                    )}
                    {!isRegistrationOpen() && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        Registration deadline has passed
                      </Alert>
                    )}
                    {event.attendeeCount >= event.capacity && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        Event is at capacity
                      </Alert>
                    )}
                  </Box>
                )
              ) : (
                <Alert severity="info">
                  Please log in to register for this event
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventDetails;
