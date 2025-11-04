import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import {
  School,
  Sports,
  Group,
  Event,
  TrendingUp,
  People,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Academic Clubs',
      description: 'Join study groups, debate clubs, and academic competitions.',
      color: '#1976d2',
    },
    {
      icon: <Sports sx={{ fontSize: 40 }} />,
      title: 'Sports & Athletics',
      description: 'Participate in various sports activities and tournaments.',
      color: '#388e3c',
    },
    {
      icon: <Group sx={{ fontSize: 40 }} />,
      title: 'Community Service',
      description: 'Make a difference through volunteer work and community projects.',
      color: '#f57c00',
    },
    {
      icon: <Event sx={{ fontSize: 40 }} />,
      title: 'Events & Workshops',
      description: 'Attend workshops, seminars, and special events.',
      color: '#7b1fa2',
    },
  ];

  const stats = [
    { label: 'Active Activities', value: '25+', icon: <TrendingUp /> },
    { label: 'Registered Students', value: '500+', icon: <People /> },
    { label: 'Upcoming Events', value: '15+', icon: <Event /> },
    { label: 'Success Stories', value: '100+', icon: <School /> },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Extracurricular Activities Platform
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
            Discover, join, and manage your extracurricular activities in one place.
            Connect with peers, track your participation, and grow beyond the classroom.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/activities')}
              sx={{
                backgroundColor: 'white',
                color: '#1976d2',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              Explore Activities
            </Button>
            {!user && (
              <Button
                variant="outlined"
                size="medium"
                onClick={() => navigate('/register')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                Get Started
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          What We Offer
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          A comprehensive platform for managing student extracurricular activities
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box
                    sx={{
                      color: feature.color,
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Platform Statistics
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    backgroundColor: 'white',
                    height: '100%',
                  }}
                >
                  <Box sx={{ color: '#1976d2', mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom>
          Ready to Get Involved?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Join our community of active students and start your extracurricular journey today.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/activities')}
          >
            Browse Activities
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/events')}
          >
            View Events
          </Button>
        </Box>
      </Container>

      {/* Categories Preview */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Popular Categories
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
            {['Sports', 'Academic', 'Cultural', 'Volunteer', 'Technology', 'Arts'].map((category) => (
              <Chip
                key={category}
                label={category}
                variant="outlined"
                size="medium"
                sx={{
                  '&:hover': { backgroundColor: '#1976d2', color: 'white' },
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/activities?category=${category.toLowerCase()}`)}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
