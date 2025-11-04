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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Edit,
  Delete,
  Person,
  School,
  AdminPanelSettings,
  Email,
  Phone,
  Badge,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  studentId?: string;
  grade?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  activityCount: number;
}

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'admin', label: 'Administrator' },
  ];

  const grades = [
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'graduate', label: 'Graduate' },
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john.doe@school.edu',
          role: 'student',
          studentId: 'STU001',
          grade: '11',
          phone: '+1 (555) 123-4567',
          isActive: true,
          createdAt: '2024-01-01',
          activityCount: 3,
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@school.edu',
          role: 'student',
          studentId: 'STU002',
          grade: '12',
          phone: '+1 (555) 234-5678',
          isActive: true,
          createdAt: '2024-01-02',
          activityCount: 2,
        },
        {
          _id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@school.edu',
          role: 'student',
          studentId: 'STU003',
          grade: '10',
          phone: '+1 (555) 345-6789',
          isActive: true,
          createdAt: '2024-01-03',
          activityCount: 1,
        },
        {
          _id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@school.edu',
          role: 'student',
          studentId: 'STU004',
          grade: '9',
          phone: '+1 (555) 456-7890',
          isActive: false,
          createdAt: '2024-01-04',
          activityCount: 0,
        },
        {
          _id: '5',
          name: 'Admin User',
          email: 'admin@school.edu',
          role: 'admin',
          isActive: true,
          createdAt: '2024-01-01',
          activityCount: 0,
        },
      ];

      setUsers(mockUsers);
      setError('');
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <AdminPanelSettings />;
      case 'student':
        return <School />;
      default:
        return <Person />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'student':
        return 'primary';
      default:
        return 'default';
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(users.map(u => 
        u._id === user._id ? { ...u, isActive: !u.isActive } : u
      ));
      
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(users.filter(u => u._id !== selectedUser._id));
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesGrade = !gradeFilter || user.grade === gradeFilter;
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesGrade && matchesStatus;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Manage Users
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            View and manage user accounts and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate('/admin/users/create')}
        >
          Create User
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All Roles</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Grade</InputLabel>
              <Select
                value={gradeFilter}
                label="Grade"
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                <MenuItem value="">All Grades</MenuItem>
                {grades.map((grade) => (
                  <MenuItem key={grade.value} value={grade.value}>
                    {grade.label}
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
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('');
                setGradeFilter('');
                setStatusFilter('');
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
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Activities</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {user.name}
                        </Typography>
                        {user.studentId && (
                          <Typography variant="body2" color="text.secondary">
                            ID: {user.studentId}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getRoleIcon(user.role)}
                      <Chip
                        label={user.role}
                        size="small"
                        color={getRoleColor(user.role) as any}
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                      {user.phone && (
                        <Typography variant="caption" color="text.secondary">
                          {user.phone}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.grade ? (
                      <Chip
                        label={user.grade}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Badge sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {user.activityCount} activities
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={user.isActive}
                          onChange={() => handleToggleActive(user)}
                          size="small"
                        />
                      }
                      label={user.isActive ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteUser(user)}
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
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedUser?.name}"? This action cannot be undone.
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

export default AdminUsers;
