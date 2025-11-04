import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  People,
  CalendarToday,
  LocationOn,
  School,
  Sports,
  Group,
  Palette,
  Build,
  MoreVert,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface Event {
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
    cost: number;
  };
}

const AdminEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEvents: Event[] = [
        {
          _id: '1',
          title: 'Basketball Practice',
          description: 'Weekly basketball practice session',
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
            cost: 0,
          },
        },
        {
          _id: '2',
          title: 'Debate Competition',
          description: 'Inter-school debate competition',
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
            cost: 10,
          },
        },
        {
          _id: '3',
          title: 'Art Exhibition Opening',
          description: 'Opening ceremony for student art exhibition',
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
            cost: 0,
          },
        },
      ];

      setEvents(mockEvents);
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

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvents(events.filter(e => e._id !== selectedEvent._id));
      toast.success('Event deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || event.type === typeFilter;
    const matchesStatus = !statusFilter || event.status === statusFilter;
    const matchesCategory = !categoryFilter || event.activity.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Manage Events
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create, edit, and manage events and activities
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/events/create')}
        >
          Create Event
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
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
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
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
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
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
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('');
                setStatusFilter('');
                setCategoryFilter('');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Attendees</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: getCategoryColor(event.activity.category),
                          mr: 1,
                          width: 24,
                          height: 24,
                        }}
                      >
                        {getCategoryIcon(event.activity.category)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {event.activity.name}
                        </Typography>
                        <Chip
                          label={event.activity.category}
                          size="small"
                          sx={{
                            bgcolor: getCategoryColor(event.activity.category),
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {format(new Date(event.date), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.startTime} - {event.endTime}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {event.location}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.type}
                      size="small"
                      color={getTypeColor(event.type) as any}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {event.attendeeCount} / {event.capacity}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={event.status}
                      size="small"
                      color={getStatusColor(event.status) as any}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/events/${event._id}/edit`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/events/${event._id}/attendees`)}
                      >
                        <People />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteEvent(event)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminEvents;
