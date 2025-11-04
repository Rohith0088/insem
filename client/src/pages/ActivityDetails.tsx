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
  Schedule,
  LocationOn,
  People,
  Person,
  Email,
  Phone,
  School,
  Sports,
  Group,
  Palette,
  Build,
  MoreVert,
  CheckCircle,
  Pending,
  Cancel,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface ActivityDetails {
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
    phone: string;
  };
  requirements: {
    gradeLevel: string[];
    maxParticipants: number;
    prerequisites: string[];
    equipment: string[];
  };
  participantCount: number;
  image: string;
  tags: string[];
  statistics: {
    totalRegistrations: number;
    activeParticipants: number;
  };
}

const ActivityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<ActivityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    fetchActivityDetails();
  }, [id]);

  const fetchActivityDetails = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockActivity: ActivityDetails = {
        _id: id || '1',
        name: 'Basketball Club',
        description: 'Join our basketball club for weekly practices and tournaments. All skill levels welcome! We focus on developing fundamental skills, teamwork, and sportsmanship. Regular practice sessions include skill drills, scrimmages, and fitness training. The club participates in inter-school competitions and friendly matches.',
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
          phone: '+1 (555) 123-4567',
        },
        requirements: {
          gradeLevel: ['9', '10', '11', '12'],
          maxParticipants: 20,
          prerequisites: ['Basic basketball skills', 'Physical fitness clearance'],
          equipment: ['Basketball shoes', 'Athletic clothing', 'Water bottle'],
        },
        participantCount: 15,
        image: '',
        tags: ['basketball', 'sports', 'team', 'competition', 'fitness'],
        statistics: {
          totalRegistrations: 18,
          activeParticipants: 15,
        },
      };

      setActivity(mockActivity);
      setIsRegistered(true); // Mock: user is registered
      setIsParticipant(true); // Mock: user is a participant
      setError('');
    } catch (err) {
      setError('Failed to load activity details');
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
      default:
        return 'default';
    }
  };

  const handleJoinActivity = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Successfully joined the activity!');
      setIsRegistered(true);
    } catch (error) {
      toast.error('Failed to join activity');
    }
  };

  const handleLeaveActivity = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Left the activity successfully');
      setIsRegistered(false);
      setIsParticipant(false);
    } catch (error) {
      toast.error('Failed to leave activity');
    }
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

  if (error || !activity) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Activity not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/activities')}
          sx={{ mb: 2 }}
        >
          ← Back to Activities
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Activity Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: getCategoryColor(activity.category),
                    mr: 2,
                    width: 60,
                    height: 60,
                  }}
                >
                  {getCategoryIcon(activity.category)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {activity.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={activity.category}
                      sx={{
                        bgcolor: getCategoryColor(activity.category),
                        color: 'white',
                      }}
                    />
                    <Chip
                      label={activity.type}
                      variant="outlined"
                    />
                    <Chip
                      label={activity.status}
                      color={getStatusColor(activity.status) as any}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" paragraph>
                {activity.description}
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* Schedule Information */}
              <Typography variant="h6" gutterBottom>
                Schedule & Location
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Day & Time
                      </Typography>
                      <Typography variant="body1">
                        {activity.schedule.day} at {activity.schedule.time}
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
                        {activity.schedule.location}
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
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Grade Levels
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {activity.requirements.gradeLevel.map((grade) => (
                      <Chip key={grade} label={grade} size="small" />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Prerequisites
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {activity.requirements.prerequisites.map((prereq) => (
                      <Chip key={prereq} label={prereq} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Grid>
              </Grid>

              {/* Equipment */}
              {activity.requirements.equipment.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Required Equipment
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {activity.requirements.equipment.map((item) => (
                      <Chip key={item} label={item} size="small" color="info" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Tags */}
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {activity.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Supervisor Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Supervisor
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>
                  {activity.supervisor.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    {activity.supervisor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Activity Supervisor
                  </Typography>
                </Box>
              </Box>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.supervisor.email}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.supervisor.phone}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Participation Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Participation
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="h4" component="span">
                    {activity.participantCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / {activity.requirements.maxParticipants} participants
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Registrations: {activity.statistics.totalRegistrations}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Participants: {activity.statistics.activeParticipants}
              </Typography>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent>
              {user ? (
                isRegistered ? (
                  <Box>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      You are registered for this activity
                    </Alert>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={handleLeaveActivity}
                    >
                      Leave Activity
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleJoinActivity}
                    disabled={activity.status !== 'active'}
                  >
                    Join Activity
                  </Button>
                )
              ) : (
                <Alert severity="info">
                  Please log in to join this activity
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ActivityDetails;
