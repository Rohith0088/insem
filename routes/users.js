const express = require('express');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Activity = require('../models/Activity');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      role, 
      grade, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (role) filter.role = role;
    if (grade) filter.grade = grade;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password -notifications')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    // Add activity participation count for each user
    for (let user of users) {
      const registrationCount = await Registration.countDocuments({ 
        user: user._id, 
        status: 'approved' 
      });
      user._doc.activityCount = registrationCount;
    }

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can access this profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get user's registrations if student
    if (user.role === 'student') {
      const registrations = await Registration.find({ user: user._id })
        .populate('activity', 'name category type status')
        .sort({ createdAt: -1 });

      user._doc.registrations = registrations;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, role, grade, phone, studentId, isActive } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (grade) updateData.grade = grade;
    if (phone) updateData.phone = phone;
    if (studentId) updateData.studentId = studentId;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error during user update' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Deactivate user account
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deactivating own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    // Deactivate user
    user.isActive = false;
    await user.save();

    // Send notification to user
    await user.addNotification(
      'Account Deactivated',
      'Your account has been deactivated by an administrator.',
      'error'
    );

    res.json({ message: 'User account deactivated successfully' });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Server error during user deactivation' });
  }
});

// @route   GET /api/users/:id/activities
// @desc    Get user's activities
// @access  Private
router.get('/:id/activities', authenticateToken, async (req, res) => {
  try {
    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const registrations = await Registration.find({ 
      user: req.params.id,
      status: 'approved'
    })
      .populate('activity', 'name category type description schedule supervisor')
      .sort({ createdAt: -1 });

    res.json({ registrations });
  } catch (error) {
    console.error('Get user activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/statistics
// @desc    Get user statistics
// @access  Private
router.get('/:id/statistics', authenticateToken, async (req, res) => {
  try {
    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userId = req.params.id;

    // Get registration statistics
    const totalRegistrations = await Registration.countDocuments({ user: userId });
    const approvedRegistrations = await Registration.countDocuments({ 
      user: userId, 
      status: 'approved' 
    });
    const pendingRegistrations = await Registration.countDocuments({ 
      user: userId, 
      status: 'pending' 
    });

    // Get activity participation by category
    const categoryStats = await Registration.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId), status: 'approved' } },
      { $lookup: { from: 'activities', localField: 'activity', foreignField: '_id', as: 'activity' } },
      { $unwind: '$activity' },
      { $group: { _id: '$activity.category', count: { $sum: 1 } } }
    ]);

    // Get attendance statistics
    const attendanceStats = await Registration.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId), status: 'approved' } },
      { $group: { 
        _id: null, 
        totalEvents: { $sum: '$attendance.totalEvents' },
        attendedEvents: { $sum: '$attendance.attendedEvents' }
      }}
    ]);

    const avgAttendanceRate = attendanceStats.length > 0 && attendanceStats[0].totalEvents > 0
      ? (attendanceStats[0].attendedEvents / attendanceStats[0].totalEvents) * 100
      : 0;

    // Get achievements count
    const achievementsCount = await Registration.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId), status: 'approved' } },
      { $group: { _id: null, totalAchievements: { $sum: { $size: '$achievements' } } } }
    ]);

    res.json({
      totalRegistrations,
      approvedRegistrations,
      pendingRegistrations,
      categoryStats,
      avgAttendanceRate: Math.round(avgAttendanceRate * 100) / 100,
      totalAchievements: achievementsCount.length > 0 ? achievementsCount[0].totalAchievements : 0
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/:id/notify
// @desc    Send notification to user
// @access  Private (Admin only)
router.post('/:id/notify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, message, type = 'info' } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    if (!['info', 'success', 'warning', 'error'].includes(type)) {
      return res.status(400).json({ message: 'Invalid notification type' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.addNotification(title, message, type);

    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ message: 'Server error during notification sending' });
  }
});

// @route   GET /api/users/stats/overview
// @desc    Get user statistics overview (Admin only)
// @access  Private (Admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalAdmins = await User.countDocuments({ role: 'admin', isActive: true });

    // Get grade distribution
    const gradeStats = await User.aggregate([
      { $match: { role: 'student', isActive: true } },
      { $group: { _id: '$grade', count: { $sum: 1 } } }
    ]);

    // Get users with registrations
    const usersWithRegistrations = await Registration.distinct('user');

    res.json({
      totalUsers,
      totalStudents,
      totalAdmins,
      gradeStats,
      activeParticipants: usersWithRegistrations.length
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
