const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin, validateProfileUpdate } = require('../middleware/validation');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public (Admin can create admin accounts)
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { name, email, password, role, studentId, grade, phone } = req.body;

    // Mock user storage (in-memory for development)
    if (!global.mockUsers) {
      global.mockUsers = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'student',
          studentId: 'STU001',
          grade: '11',
          phone: '+1234567890',
          isActive: true
        },
        {
          _id: '2',
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          isActive: true
        }
      ];
    }

    // Check if user already exists
    const existingUser = global.mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Check if studentId already exists (if provided)
    if (studentId) {
      const existingStudentId = global.mockUsers.find(u => u.studentId === studentId);
      if (existingStudentId) {
        return res.status(400).json({ message: 'Student ID already exists' });
      }
    }

    // Create new user
    const newUser = {
      _id: (global.mockUsers.length + 1).toString(),
      name,
      email,
      password,
      role: role || 'student',
      studentId,
      grade,
      phone,
      isActive: true
    };

    global.mockUsers.push(newUser);

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentId: newUser.studentId,
        grade: newUser.grade
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Initialize mock users if not exists
    if (!global.mockUsers) {
      global.mockUsers = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'student',
          studentId: 'STU001',
          grade: '11',
          isActive: true,
          profilePicture: ''
        },
        {
          _id: '2',
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          isActive: true,
          profilePicture: ''
        }
      ];
    }

    // Find user by email
    const user = global.mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Verify password (simple comparison for mock data)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        grade: user.grade,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const { name, phone, grade, profilePicture } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (grade) updateData.grade = grade;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
});

// @route   GET /api/auth/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    res.json({ notifications: user.notifications.reverse() });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/notifications/:notificationId/read
// @desc    Mark notification as read
// @access  Private
router.put('/notifications/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const user = await User.findById(req.user._id);
    const notification = user.notifications.id(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    notification.isRead = true;
    await user.save();
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/auth/notifications/:notificationId
// @desc    Delete notification
// @access  Private
router.delete('/notifications/:notificationId', authenticateToken, async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.notifications.pull(notificationId);
    await user.save();
    
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
