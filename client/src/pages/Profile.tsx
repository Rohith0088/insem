import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  School,
  Badge,
  Edit,
  Save,
  Cancel,
  CheckCircle,
  Pending,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    grade: user?.grade || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      grade: user?.grade || '',
    });
    setEditing(false);
  };

  // Mock data for user's activities and achievements
  const userActivities = [
    {
      id: '1',
      name: 'Basketball Club',
      status: 'active',
      joinDate: '2024-01-15',
      attendance: 85,
    },
    {
      id: '2',
      name: 'Debate Society',
      status: 'active',
      joinDate: '2024-01-10',
      attendance: 92,
    },
  ];

  const achievements = [
    {
      id: '1',
      title: 'Team Player',
      description: 'Consistent participation in team activities',
      date: '2024-01-20',
    },
    {
      id: '2',
      title: 'Debate Champion',
      description: 'Won the inter-school debate competition',
      date: '2024-01-18',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle />;
      case 'pending':
        return <Pending />;
      case 'inactive':
        return <CancelIcon />;
      default:
        return <Person />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {user?.role === 'admin' ? 'Administrator' : 'Student'}
              </Typography>
              {user?.studentId && (
                <Typography variant="body2" color="text.secondary">
                  Student ID: {user.studentId}
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditing(true)}
                  disabled={editing}
                >
                  Edit Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing || loading}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ''}
                    disabled
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing || loading}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Grade Level"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    disabled={!editing || loading}
                    InputProps={{
                      startAdornment: <School sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </Grid>

              {editing && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* My Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                My Activities
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {userActivities.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getStatusIcon(activity.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.name}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            Joined: {new Date(activity.joinDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Attendance: {activity.attendance}%
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip
                      label={activity.status}
                      color={getStatusColor(activity.status) as any}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Achievements
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {achievements.map((achievement) => (
                  <ListItem key={achievement.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Badge color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={achievement.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {achievement.description}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Earned: {new Date(achievement.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Activity Statistics
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {userActivities.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Activities
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" gutterBottom>
                      88%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Attendance
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main" gutterBottom>
                      {achievements.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Achievements
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main" gutterBottom>
                      45
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Events Attended
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
