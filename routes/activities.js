const express = require('express');
const Activity = require('../models/Activity');
const Registration = require('../models/Registration');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validateActivity } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/activities
// @desc    Get all activities with optional filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      category, 
      type, 
      status, 
      search, 
      grade,
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (grade && grade !== 'all') {
      filter['requirements.gradeLevel'] = { $in: [grade, 'all'] };
    }

    const activities = await Activity.find(filter)
      .populate('participants', 'name email studentId')
      .populate('supervisor')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(filter);

    // Add user participation status if authenticated
    if (req.user) {
      for (let activity of activities) {
        const registration = await Registration.findOne({
          user: req.user._id,
          activity: activity._id
        });
        activity._doc.userRegistration = registration;
        activity._doc.isParticipant = activity.participants.some(
          p => p._id.toString() === req.user._id.toString()
        );
      }
    }

    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/:id
// @desc    Get single activity
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('participants', 'name email studentId grade profilePicture')
      .populate('supervisor');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Add user participation status if authenticated
    if (req.user) {
      const registration = await Registration.findOne({
        user: req.user._id,
        activity: activity._id
      });
      activity._doc.userRegistration = registration;
      activity._doc.isParticipant = activity.participants.some(
        p => p._id.toString() === req.user._id.toString()
      );
    }

    res.json({ activity });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/activities
// @desc    Create new activity
// @access  Private (Admin only)
router.post('/', authenticateToken, requireAdmin, validateActivity, async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();

    const populatedActivity = await Activity.findById(activity._id)
      .populate('participants', 'name email studentId')
      .populate('supervisor');

    res.status(201).json({
      message: 'Activity created successfully',
      activity: populatedActivity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ message: 'Server error during activity creation' });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validateActivity, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('participants', 'name email studentId')
     .populate('supervisor');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({
      message: 'Activity updated successfully',
      activity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ message: 'Server error during activity update' });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete activity
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if activity has participants
    if (activity.participants.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete activity with active participants' 
      });
    }

    // Delete related registrations
    await Registration.deleteMany({ activity: req.params.id });

    await Activity.findByIdAndDelete(req.params.id);

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ message: 'Server error during activity deletion' });
  }
});

// @route   GET /api/activities/:id/participants
// @desc    Get activity participants
// @access  Private (Admin only)
router.get('/:id/participants', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate({
        path: 'participants',
        select: 'name email studentId grade phone profilePicture',
        options: { sort: { name: 1 } }
      });

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Get registration details for each participant
    const participantsWithDetails = await Promise.all(
      activity.participants.map(async (participant) => {
        const registration = await Registration.findOne({
          user: participant._id,
          activity: activity._id
        });
        
        return {
          ...participant.toObject(),
          registration
        };
      })
    );

    res.json({ participants: participantsWithDetails });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/categories
// @desc    Get activity categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Activity.distinct('category');
    const types = await Activity.distinct('type');
    
    res.json({ categories, types });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/stats/overview
// @desc    Get activity statistics
// @access  Private (Admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalActivities = await Activity.countDocuments();
    const activeActivities = await Activity.countDocuments({ status: 'active' });
    const totalParticipants = await Activity.aggregate([
      { $group: { _id: null, total: { $sum: { $size: '$participants' } } } }
    ]);

    const categoryStats = await Activity.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const typeStats = await Activity.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      totalActivities,
      activeActivities,
      totalParticipants: totalParticipants[0]?.total || 0,
      categoryStats,
      typeStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
