import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
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
  Schedule,
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

interface Activity {
  _id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  status: string;
  schedule: {
    day: string;
    time: string;
    location: string;
  };
  supervisor: {
    name: string;
    email: string;
  };
  requirements: {
    gradeLevel: string[];
    maxParticipants: number;
  };
  participantCount: number;
  statistics: {
    totalRegistrations: number;
    activeParticipants: number;
  };
}

const AdminActivities: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const categories = [
    { value: 'club', label: 'Club' },
    { value: 'sport', label: 'Sports' },
    { value: 'academic', label: 'Academic' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'other', label: 'Other' },
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'full', label: 'Full' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockActivities: Activity[] = [
        {
          _id: '1',
          name: 'Basketball Club',
          description: 'Weekly basketball practices and tournaments',
          category: 'sport',
          type: 'ongoing',
          status: 'active',
          schedule: {
            day: 'Tuesday',
            time: '4:00 PM',
            location: 'Gymnasium',
          },
          supervisor: {
            name: 'Coach Johnson',
            email: 'coach.johnson@school.edu',
          },
          requirements: {
            gradeLevel: ['9', '10', '11', '12'],
            maxParticipants: 20,
          },
          participantCount: 15,
          statistics: {
            totalRegistrations: 18,
            activeParticipants: 15,
          },
        },
        {
          _id: '2',
          name: 'Debate Society',
          description: 'Competitive debate and public speaking',
          category: 'academic',
          type: 'ongoing',
          status: 'active',
          schedule: {
            day: 'Thursday',
            time: '3:30 PM',
            location: 'Room 201',
          },
          supervisor: {
            name: 'Ms. Smith',
            email: 'ms.smith@school.edu',
          },
          requirements: {
            gradeLevel: ['10', '11', '12'],
            maxParticipants: 15,
          },
          participantCount: 8,
          statistics: {
            totalRegistrations: 12,
            activeParticipants: 8,
          },
        },
        {
          _id: '3',
          name: 'Art Club',
          description: 'Creative expression through various art forms',
          category: 'cultural',
          type: 'ongoing',
          status: 'active',
          schedule: {
            day: 'Wednesday',
            time: '4:30 PM',
            location: 'Art Studio',
          },
          supervisor: {
            name: 'Mr. Davis',
            email: 'mr.davis@school.edu',
          },
          requirements: {
            gradeLevel: ['9', '10', '11', '12'],
            maxParticipants: 25,
          },
          participantCount: 18,
          statistics: {
            totalRegistrations: 22,
            activeParticipants: 18,
          },
        },
      ];

      setActivities(mockActivities);
      setError('');
    } catch (err) {
      setError('Failed to load activities');
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
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'full':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleDeleteActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedActivity) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActivities(activities.filter(a => a._id !== selectedActivity._id));
      toast.success('Activity deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedActivity(null);
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || activity.category === categoryFilter;
    const matchesStatus = !statusFilter || activity.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Manage Activities
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create, edit, and manage extracurricular activities
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/activities/create')}
        >
          Create Activity
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
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
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
                setStatusFilter('');
              }}
            >
              Clear
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
                <TableCell>Activity</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Schedule</TableCell>
                <TableCell>Supervisor</TableCell>
                <TableCell>Participants</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: getCategoryColor(activity.category),
                          mr: 2,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {getCategoryIcon(activity.category)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {activity.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.description}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={activity.category}
                      size="small"
                      sx={{
                        bgcolor: getCategoryColor(activity.category),
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {activity.schedule.day} at {activity.schedule.time}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.schedule.location}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {activity.supervisor.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.supervisor.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {activity.participantCount} / {activity.requirements.maxParticipants}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.statistics.totalRegistrations} total registrations
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={activity.status}
                      size="small"
                      color={getStatusColor(activity.status) as any}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/activities/${activity._id}/edit`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/activities/${activity._id}/participants`)}
                      >
                        <People />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteActivity(activity)}
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
        <DialogTitle>Delete Activity</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedActivity?.name}"? This action cannot be undone.
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

export default AdminActivities;
