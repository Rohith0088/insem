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
  CheckCircle,
  Cancel,
  Person,
  School,
  Schedule,
  Email,
  Phone,
  Badge,
  Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface Registration {
  _id: string;
  user: {
    name: string;
    email: string;
    studentId: string;
    grade: string;
  };
  activity: {
    name: string;
    category: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  registrationDate: string;
  approvedBy?: {
    name: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
  attendance: {
    totalEvents: number;
    attendedEvents: number;
    attendanceRate: number;
  };
}

const AdminRegistrations: React.FC = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');

  const statuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'withdrawn', label: 'Withdrawn' },
  ];

  const activities = [
    { value: 'basketball', label: 'Basketball Club' },
    { value: 'debate', label: 'Debate Society' },
    { value: 'art', label: 'Art Club' },
    { value: 'soccer', label: 'Soccer Team' },
  ];

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRegistrations: Registration[] = [
        {
          _id: '1',
          user: {
            name: 'John Doe',
            email: 'john.doe@school.edu',
            studentId: 'STU001',
            grade: '11',
          },
          activity: {
            name: 'Basketball Club',
            category: 'sport',
          },
          status: 'pending',
          registrationDate: '2024-01-15',
          attendance: {
            totalEvents: 0,
            attendedEvents: 0,
            attendanceRate: 0,
          },
        },
        {
          _id: '2',
          user: {
            name: 'Jane Smith',
            email: 'jane.smith@school.edu',
            studentId: 'STU002',
            grade: '12',
          },
          activity: {
            name: 'Debate Society',
            category: 'academic',
          },
          status: 'approved',
          registrationDate: '2024-01-10',
          approvedBy: {
            name: 'Admin User',
          },
          approvedAt: '2024-01-12',
          attendance: {
            totalEvents: 5,
            attendedEvents: 4,
            attendanceRate: 80,
          },
        },
        {
          _id: '3',
          user: {
            name: 'Mike Johnson',
            email: 'mike.johnson@school.edu',
            studentId: 'STU003',
            grade: '10',
          },
          activity: {
            name: 'Art Club',
            category: 'cultural',
          },
          status: 'rejected',
          registrationDate: '2024-01-08',
          approvedBy: {
            name: 'Admin User',
          },
          approvedAt: '2024-01-10',
          rejectionReason: 'Insufficient prerequisites',
          attendance: {
            totalEvents: 0,
            attendedEvents: 0,
            attendanceRate: 0,
          },
        },
        {
          _id: '4',
          user: {
            name: 'Sarah Wilson',
            email: 'sarah.wilson@school.edu',
            studentId: 'STU004',
            grade: '9',
          },
          activity: {
            name: 'Basketball Club',
            category: 'sport',
          },
          status: 'withdrawn',
          registrationDate: '2024-01-05',
          attendance: {
            totalEvents: 2,
            attendedEvents: 1,
            attendanceRate: 50,
          },
        },
      ];

      setRegistrations(mockRegistrations);
      setError('');
    } catch (err) {
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'withdrawn':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle />;
      case 'rejected':
        return <Cancel />;
      default:
        return <Schedule />;
    }
  };

  const handleAction = (registration: Registration, type: 'approve' | 'reject') => {
    setSelectedRegistration(registration);
    setActionType(type);
    setActionDialogOpen(true);
    setRejectionReason('');
  };

  const confirmAction = async () => {
    if (!selectedRegistration) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedRegistrations = registrations.map(reg => {
        if (reg._id === selectedRegistration._id) {
          return {
            ...reg,
            status: (actionType === 'approve' ? 'approved' : 'rejected') as 'approved' | 'rejected',
            approvedBy: { name: 'Current Admin' },
            approvedAt: new Date().toISOString(),
            rejectionReason: actionType === 'reject' ? rejectionReason : undefined,
          };
        }
        return reg;
      });
      
      setRegistrations(updatedRegistrations);
      toast.success(`Registration ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
      setActionDialogOpen(false);
      setSelectedRegistration(null);
      setRejectionReason('');
    } catch (error) {
      toast.error(`Failed to ${actionType} registration`);
    }
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.user.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || registration.status === statusFilter;
    const matchesActivity = !activityFilter || registration.activity.name.toLowerCase().includes(activityFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesActivity;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Registrations
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Review and manage student activity registrations
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search registrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Activity</InputLabel>
              <Select
                value={activityFilter}
                label="Activity"
                onChange={(e) => setActivityFilter(e.target.value)}
              >
                <MenuItem value="">All Activities</MenuItem>
                {activities.map((activity) => (
                  <MenuItem key={activity.value} value={activity.value}>
                    {activity.label}
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
                setStatusFilter('');
                setActivityFilter('');
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
                <TableCell>Student</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>
                        {registration.user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {registration.user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {registration.user.studentId} • Grade {registration.user.grade}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {registration.user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {registration.activity.name}
                      </Typography>
                      <Chip
                        label={registration.activity.category}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(registration.registrationDate), 'MMM dd, yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getStatusIcon(registration.status)}
                      <Chip
                        label={registration.status}
                        size="small"
                        color={getStatusColor(registration.status) as any}
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    {registration.approvedBy && (
                      <Typography variant="caption" color="text.secondary">
                        By {registration.approvedBy.name}
                      </Typography>
                    )}
                    {registration.rejectionReason && (
                      <Typography variant="caption" color="error">
                        {registration.rejectionReason}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {registration.attendance.attendedEvents} / {registration.attendance.totalEvents} events
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {registration.attendance.attendanceRate}% attendance
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {registration.status === 'pending' && (
                        <>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleAction(registration, 'approve')}
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleAction(registration, 'reject')}
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/registrations/${registration._id}`)}
                      >
                        <Visibility />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
        <DialogTitle>
          {actionType === 'approve' ? 'Approve' : 'Reject'} Registration
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            {actionType === 'approve' 
              ? `Approve ${selectedRegistration?.user.name}'s registration for ${selectedRegistration?.activity.name}?`
              : `Reject ${selectedRegistration?.user.name}'s registration for ${selectedRegistration?.activity.name}?`
            }
          </Typography>
          {actionType === 'reject' && (
            <TextField
              fullWidth
              label="Rejection Reason"
              multiline
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmAction} 
            color={actionType === 'approve' ? 'success' : 'error'} 
            variant="contained"
            disabled={actionType === 'reject' && !rejectionReason.trim()}
          >
            {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminRegistrations;
