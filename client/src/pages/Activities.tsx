import React, { useState, useEffect, useCallback } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

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
    frequency: string;
  };
  supervisor: {
    name: string;
    email: string;
  };
  requirements: {
    gradeLevel: string[];
    maxParticipants: number;
    prerequisites: string[];
  };
  participantCount: number;
  image: string;
  tags: string[];
}

const Activities: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { value: 'club', label: 'Club', icon: <Group /> },
    { value: 'sport', label: 'Sports', icon: <Sports /> },
    { value: 'academic', label: 'Academic', icon: <School /> },
    { value: 'volunteer', label: 'Volunteer', icon: <People /> },
    { value: 'cultural', label: 'Cultural', icon: <Palette /> },
    { value: 'other', label: 'Other', icon: <MoreVert /> },
  ];

  const types = [
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'event', label: 'Event' },
    { value: 'competition', label: 'Competition' },
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'full', label: 'Full' },
  ];

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockActivities: Activity[] = [
        {
          _id: '1',
          name: 'Basketball Club',
          description: 'Join our basketball club for weekly practices and tournaments. All skill levels welcome!',
          category: 'sport',
          type: 'ongoing',
          status: 'active',
          schedule: {
            day: 'Tuesday',
            time: '4:00 PM',
            location: 'Gymnasium',
            frequency: 'weekly',
          },
          supervisor: {
            name: 'Coach Johnson',
            email: 'coach.johnson@school.edu',
          },
          requirements: {
            gradeLevel: ['9', '10', '11', '12'],
            maxParticipants: 20,
            prerequisites: ['Basic basketball skills'],
          },
          participantCount: 15,
          image: '',
          tags: ['basketball', 'sports', 'team'],
        },
        {
          _id: '2',
          name: 'Debate Society',
          description: 'Develop your public speaking and critical thinking skills through competitive debate.',
          category: 'academic',
          type: 'ongoing',
          status: 'active',
          schedule: {
            day: 'Thursday',
            time: '3:30 PM',
            location: 'Room 201',
            frequency: 'weekly',
          },
          supervisor: {
            name: 'Ms. Smith',
            email: 'ms.smith@school.edu',
          },
          requirements: {
            gradeLevel: ['10', '11', '12'],
            maxParticipants: 15,
            prerequisites: ['Strong communication skills'],
          },
          participantCount: 8,
          image: '',
          tags: ['debate', 'public speaking', 'academic'],
        },
        {
          _id: '3',
          name: 'Art Club',
          description: 'Express your creativity through various art forms including painting, drawing, and sculpture.',
          category: 'cultural',
          type: 'ongoing',
          status: 'active',
          schedule: {
            day: 'Wednesday',
            time: '4:30 PM',
            location: 'Art Studio',
            frequency: 'weekly',
          },
          supervisor: {
            name: 'Mr. Davis',
            email: 'mr.davis@school.edu',
          },
          requirements: {
            gradeLevel: ['9', '10', '11', '12'],
            maxParticipants: 25,
            prerequisites: [],
          },
          participantCount: 18,
          image: '',
          tags: ['art', 'creativity', 'painting'],
        },
      ];

      let filteredActivities = mockActivities;

      if (searchTerm) {
        filteredActivities = filteredActivities.filter(activity =>
          activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (categoryFilter) {
        filteredActivities = filteredActivities.filter(activity =>
          activity.category === categoryFilter
        );
      }

      if (typeFilter) {
        filteredActivities = filteredActivities.filter(activity =>
          activity.type === typeFilter
        );
      }

      if (statusFilter) {
        filteredActivities = filteredActivities.filter(activity =>
          activity.status === statusFilter
        );
      }

      setActivities(filteredActivities);
      setTotalPages(Math.ceil(filteredActivities.length / 6));
      setError('');
    } catch (err) {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, categoryFilter, typeFilter, statusFilter]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

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
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData?.icon || <MoreVert />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'full':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setTypeFilter('');
    setStatusFilter('');
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Activities
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover and join extracurricular activities that interest you.
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ minWidth: 200 }}
          />
          
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
            {activities.map((activity) => (
              <Grid item xs={12} md={6} lg={4} key={activity._id}>
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
                          bgcolor: getCategoryColor(activity.category),
                          mr: 2,
                        }}
                      >
                        {getCategoryIcon(activity.category)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                          {activity.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip
                            label={activity.category}
                            size="small"
                            sx={{
                              bgcolor: getCategoryColor(activity.category),
                              color: 'white',
                            }}
                          />
                          <Chip
                            label={activity.status}
                            size="small"
                            color={getStatusColor(activity.status) as any}
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
                      {activity.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {activity.schedule.day} at {activity.schedule.time}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {activity.schedule.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <People sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption">
                        {activity.participantCount} / {activity.requirements.maxParticipants || '∞'} participants
                      </Typography>
                    </Box>

                    {activity.tags.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {activity.tags.slice(0, 3).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {activity.tags.length > 3 && (
                          <Chip
                            label={`+${activity.tags.length - 3}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/activities/${activity._id}`)}
                    >
                      View Details
                    </Button>
                    {user && activity.status === 'active' && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          // Handle registration
                          console.log('Register for activity:', activity._id);
                        }}
                      >
                        Join
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {activities.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No activities found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or browse all activities.
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

export default Activities;
