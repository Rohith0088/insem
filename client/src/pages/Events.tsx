import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Search,
  FilterList,
  CalendarToday,
  Schedule,
  LocationOn,
  People,
  Event,
  School,
  Sports,
  Group,
  Palette,
  Build,
  MoreVert,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

interface EventData {
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
  };
  organizer: {
    name: string;
    email: string;
  };
  attendeeCount: number;
  requirements: {
    registrationRequired: boolean;
    registrationDeadline: string;
    cost: number;
  };
}

const Events: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const types = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'practice', label: 'Practice' },
    { value: 'competition', label: 'Competition' },
    { value: 'social', label: 'Social' },
    { value: 'fundraiser', label: 'Fundraiser' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'other', label: 'Other' },
  ];

  const statuses = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const categories = [
    { value: 'sport', label: 'Sports' },
    { value: 'academic', label: 'Academic' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'club', label: 'Club' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchEvents();
  }, [page, searchTerm, typeFilter, statusFilter, categoryFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEvents: EventData[] = [
        {
          _id: '1',
          title: 'Basketball Practice',
          description: 'Weekly basketball practice session focusing on fundamental skills and team coordination.',
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
          },
          organizer: {
            name: 'Coach Johnson',
            email: 'coach.johnson@school.edu',
          },
          attendeeCount: 15,
          requirements: {
            registrationRequired: false,
            registrationDeadline: '',
            cost: 0,
          },
        },
        {
          _id: '2',
          title: 'Debate Competition',
          description: 'Inter-school debate competition featuring teams from across the district.',
          type: 'competition',
          date: '2024-01-20',
          startTime: '09:00',
          endTime: '17:00',
          location: 'Auditorium',
          capacity: 100,
          status: 'scheduled',
          activity: {
            name: 'Debate Society',
            category: 'academic',
          },
          organizer: {
            name: 'Ms. Smith',
            email: 'ms.smith@school.edu',
          },
          attendeeCount: 45,
          requirements: {
            registrationRequired: true,
            registrationDeadline: '2024-01-18',
            cost: 10,
          },
        },
        {
          _id: '3',
          title: 'Art Exhibition Opening',
          description: 'Opening ceremony for the annual student art exhibition showcasing creative works.',
          type: 'social',
          date: '2024-01-25',
          startTime: '18:00',
          endTime: '20:00',
          location: 'Art Gallery',
          capacity: 50,
          status: 'scheduled',
          activity: {
            name: 'Art Club',
            category: 'cultural',
          },
          organizer: {
            name: 'Mr. Davis',
            email: 'mr.davis@school.edu',
          },
          attendeeCount: 32,
          requirements: {
            registrationRequired: false,
            registrationDeadline: '',
            cost: 0,
          },
        },
      ];

      let filteredEvents = mockEvents;

      if (searchTerm) {
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.activity.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (typeFilter) {
        filteredEvents = filteredEvents.filter(event =>
          event.type === typeFilter
        );
      }

      if (statusFilter) {
        filteredEvents = filteredEvents.filter(event =>
          event.status === statusFilter
        );
      }

      if (categoryFilter) {
        filteredEvents = filteredEvents.filter(event =>
          event.activity.category === categoryFilter
        );
      }

      setEvents(filteredEvents);
      setTotalPages(Math.ceil(filteredEvents.length / 6));
      setError('');
    } catch (err) {
      setError('Failed to load events');
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
    setCategoryFilter('');
    setPage(1);
  };

  const isEventUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  const isRegistrationOpen = (event: EventData) => {
    if (!event.requirements.registrationRequired) return true;
    if (!event.requirements.registrationDeadline) return true;
    return new Date(event.requirements.registrationDeadline) > new Date();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Events
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover and register for upcoming events and activities.
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 200 }}
          />
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              {types.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              label="Category"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} md={6} lg={4} key={event._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: getCategoryColor(event.activity.category),
                          mr: 2,
                        }}
                      >
                        {getCategoryIcon(event.activity.category)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                          {event.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip
                            label={event.activity.category}
                            size="small"
                            sx={{
                              bgcolor: getCategoryColor(event.activity.category),
                              color: 'white',
                            }}
                          />
                          <Chip
                            label={event.type}
                            size="small"
                            color={getTypeColor(event.type) as any}
                            variant="outlined"
                          />
                          <Chip
                            label={event.status}
                            size="small"
                            color={getStatusColor(event.status) as any}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {event.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {format(new Date(event.date), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {event.startTime} - {event.endTime}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {event.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {event.attendeeCount} / {event.capacity} attendees
                      </Typography>
                    </Box>

                    {event.requirements.cost > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={`$${event.requirements.cost}`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      </Box>
                    )}

                    {event.requirements.registrationRequired && (
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label="Registration Required"
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      View Details
                    </Button>
                    {user && isEventUpcoming(event.date) && isRegistrationOpen(event) && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          // Handle registration
                          console.log('Register for event:', event._id);
                        }}
                      >
                        Register
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {events.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No events found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or browse all events.
              </Typography>
            </Box>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Events;
