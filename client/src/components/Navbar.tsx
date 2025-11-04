import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
} from '@mui/material';
import {
  AccountCircle,
  Notifications,
  Dashboard,
  AdminPanelSettings,
  ExitToApp,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    handleClose();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => navigate('/')}
        >
          Extracurricular Platform
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Navigation Links */}
          <Button
            color="inherit"
            onClick={() => navigate('/activities')}
            sx={{ 
              backgroundColor: isActive('/activities') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Activities
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/events')}
            sx={{ 
              backgroundColor: isActive('/events') ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
            }}
          >
            Events
          </Button>

          {user ? (
            <>
              {/* Notifications */}
              <IconButton
                size="large"
                color="inherit"
                onClick={handleNotificationMenu}
              >
                <Badge badgeContent={0} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              {/* User Menu */}
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                {user.profilePicture ? (
                  <Avatar 
                    src={user.profilePicture} 
                    sx={{ width: 32, height: 32 }}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>
                  <Dashboard sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                {user.role === 'admin' && (
                  <MenuItem onClick={() => { navigate('/admin'); handleClose(); }}>
                    <AdminPanelSettings sx={{ mr: 1 }} />
                    Admin Panel
                  </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>

              <Menu
                anchorEl={notificationAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
              >
                <MenuItem onClick={handleNotificationClose}>
                  No notifications
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button 
                color="inherit" 
                onClick={() => navigate('/register')}
                variant="outlined"
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': { 
                    borderColor: 'white', 
                    backgroundColor: 'rgba(255,255,255,0.1)' 
                  }
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
