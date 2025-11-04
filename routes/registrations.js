const express = require('express');
const Registration = require('../models/Registration');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/registrations
// @desc    Register for activity
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { activityId } = req.body;

    if (!activityId) {
      return res.status(400).json({ message: 'Activity ID is required' });
    }

    // Check if activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if activity is active
    if (activity.status !== 'active') {
      return res.status(400).json({ message: 'Activity is not currently accepting registrations' });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      activity: activityId
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this activity' });
    }

    // Check capacity
    if (activity.requirements.maxParticipants && 
        activity.participants.length >= activity.requirements.maxParticipants) {
      return res.status(400).json({ message: 'Activity is at maximum capacity' });
    }

    // Check grade requirements
    if (activity.requirements.gradeLevel.length > 0 && 
        !activity.requirements.gradeLevel.includes(req.user.grade) &&
        !activity.requirements.gradeLevel.includes('all')) {
      return res.status(400).json({ message: 'You do not meet the grade requirements for this activity' });
    }

    // Create registration
    const registration = new Registration({
      user: req.user._id,
      activity: activityId,
      status: 'pending'
    });

    await registration.save();

    // Add user to activity participants
    await activity.addParticipant(req.user._id);

    // Send notification to user
    await req.user.addNotification(
      'Activity Registration Submitted',
      `Your registration for "${activity.name}" has been submitted and is pending approval.`,
      'info'
    );

    // Send notification to activity supervisor/admin
    const adminUsers = await User.find({ role: 'admin' });
    for (let admin of adminUsers) {
      await admin.addNotification(
        'New Activity Registration',
        `${req.user.name} has registered for "${activity.name}" and is awaiting approval.`,
        'info'
      );
    }

    const populatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'name email studentId grade')
      .populate('activity', 'name category type supervisor');

    res.status(201).json({
      message: 'Registration submitted successfully',
      registration: populatedRegistration
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   GET /api/registrations/my
// @desc    Get user's registrations
// @access  Private
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('activity', 'name category type status supervisor schedule')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ registrations });
  } catch (error) {
    console.error('Get user registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/registrations
// @desc    Get all registrations (Admin only)
// @access  Private (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      status, 
      activity, 
      page = 1, 
      limit = 10 
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (activity) filter.activity = activity;

    const registrations = await Registration.find(filter)
      .populate('user', 'name email studentId grade')
      .populate('activity', 'name category type')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Registration.countDocuments(filter);

    res.json({
      registrations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/registrations/:id
// @desc    Get single registration
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('user', 'name email studentId grade phone')
      .populate('activity', 'name category type description supervisor')
      .populate('approvedBy', 'name email');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if user can access this registration
    if (req.user.role !== 'admin' && registration.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ registration });
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/registrations/:id/approve
// @desc    Approve registration
// @access  Private (Admin only)
router.put('/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { notes } = req.body;

    const registration = await Registration.findById(req.params.id)
      .populate('user')
      .populate('activity');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({ message: 'Registration is not pending approval' });
    }

    // Approve registration
    await registration.approve(req.user._id, notes);

    // Send notification to user
    await registration.user.addNotification(
      'Registration Approved',
      `Your registration for "${registration.activity.name}" has been approved!`,
      'success'
    );

    const updatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'name email studentId grade')
      .populate('activity', 'name category type')
      .populate('approvedBy', 'name');

    res.json({
      message: 'Registration approved successfully',
      registration: updatedRegistration
    });
  } catch (error) {
    console.error('Approve registration error:', error);
    res.status(500).json({ message: 'Server error during approval' });
  }
});

// @route   PUT /api/registrations/:id/reject
// @desc    Reject registration
// @access  Private (Admin only)
router.put('/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const registration = await Registration.findById(req.params.id)
      .populate('user')
      .populate('activity');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({ message: 'Registration is not pending approval' });
    }

    // Reject registration
    await registration.reject(req.user._id, reason);

    // Remove user from activity participants
    await registration.activity.removeParticipant(registration.user._id);

    // Send notification to user
    await registration.user.addNotification(
      'Registration Rejected',
      `Your registration for "${registration.activity.name}" has been rejected. Reason: ${reason}`,
      'error'
    );

    const updatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'name email studentId grade')
      .populate('activity', 'name category type')
      .populate('approvedBy', 'name');

    res.json({
      message: 'Registration rejected successfully',
      registration: updatedRegistration
    });
  } catch (error) {
    console.error('Reject registration error:', error);
    res.status(500).json({ message: 'Server error during rejection' });
  }
});

// @route   DELETE /api/registrations/:id
// @desc    Withdraw registration
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('user')
      .populate('activity');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check if user can withdraw this registration
    if (req.user.role !== 'admin' && registration.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update status to withdrawn
    registration.status = 'withdrawn';
    await registration.save();

    // Remove user from activity participants
    await registration.activity.removeParticipant(registration.user._id);

    // Send notification to user
    await registration.user.addNotification(
      'Registration Withdrawn',
      `You have withdrawn from "${registration.activity.name}".`,
      'info'
    );

    res.json({ message: 'Registration withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw registration error:', error);
    res.status(500).json({ message: 'Server error during withdrawal' });
  }
});

// @route   PUT /api/registrations/:id/attendance
// @desc    Update attendance for registration
// @access  Private (Admin only)
router.put('/:id/attendance', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { totalEvents, attendedEvents } = req.body;

    if (totalEvents === undefined || attendedEvents === undefined) {
      return res.status(400).json({ message: 'Total events and attended events are required' });
    }

    if (totalEvents < 0 || attendedEvents < 0 || attendedEvents > totalEvents) {
      return res.status(400).json({ message: 'Invalid attendance data' });
    }

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await registration.updateAttendance(totalEvents, attendedEvents);

    const updatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'name email studentId grade')
      .populate('activity', 'name category type');

    res.json({
      message: 'Attendance updated successfully',
      registration: updatedRegistration
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Server error during attendance update' });
  }
});

// @route   POST /api/registrations/:id/achievement
// @desc    Add achievement to registration
// @access  Private (Admin only)
router.post('/:id/achievement', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Achievement title is required' });
    }

    const registration = await Registration.findById(req.params.id)
      .populate('user')
      .populate('activity');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await registration.addAchievement(title, description, req.user._id);

    // Send notification to user
    await registration.user.addNotification(
      'New Achievement Earned!',
      `Congratulations! You've earned the achievement "${title}" in ${registration.activity.name}.`,
      'success'
    );

    const updatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'name email studentId grade')
      .populate('activity', 'name category type');

    res.json({
      message: 'Achievement added successfully',
      registration: updatedRegistration
    });
  } catch (error) {
    console.error('Add achievement error:', error);
    res.status(500).json({ message: 'Server error during achievement addition' });
  }
});

// @route   PUT /api/registrations/:id/performance
// @desc    Update performance rating
// @access  Private (Admin only)
router.put('/:id/performance', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await registration.updatePerformance(rating, feedback);

    const updatedRegistration = await Registration.findById(registration._id)
      .populate('user', 'name email studentId grade')
      .populate('activity', 'name category type');

    res.json({
      message: 'Performance updated successfully',
      registration: updatedRegistration
    });
  } catch (error) {
    console.error('Update performance error:', error);
    res.status(500).json({ message: 'Server error during performance update' });
  }
});

module.exports = router;
