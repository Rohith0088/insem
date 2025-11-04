const express = require('express');
const Event = require('../models/Event');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validateEvent } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events with optional filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      activity, 
      type, 
      status, 
      dateFrom, 
      dateTo,
      search,
      page = 1, 
      limit = 10 
    } = req.query;

    // Build filter object
    const filter = {};
    if (activity) filter.activity = activity;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const events = await Event.find(filter)
      .populate('activity', 'name category type')
      .populate('organizer', 'name email')
      .populate('attendees.user', 'name email studentId')
      .sort({ date: 1, startTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(filter);

    // Add user attendance status if authenticated
    if (req.user) {
      for (let event of events) {
        const userAttendance = event.attendees.find(
          attendee => attendee.user._id.toString() === req.user._id.toString()
        );
        event._doc.userAttendance = userAttendance;
        event._doc.isRegistered = !!userAttendance;
      }
    }

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('activity', 'name category type description')
      .populate('organizer', 'name email phone')
      .populate('attendees.user', 'name email studentId grade profilePicture');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Add user attendance status if authenticated
    if (req.user) {
      const userAttendance = event.attendees.find(
        attendee => attendee.user._id.toString() === req.user._id.toString()
      );
      event._doc.userAttendance = userAttendance;
      event._doc.isRegistered = !!userAttendance;
    }

    res.json({ event });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Admin only)
router.post('/', authenticateToken, requireAdmin, validateEvent, async (req, res) => {
  try {
    // Verify activity exists
    const activity = await Activity.findById(req.body.activity);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const event = new Event({
      ...req.body,
      organizer: req.user._id
    });

    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('activity', 'name category type')
      .populate('organizer', 'name email')
      .populate('attendees.user', 'name email studentId');

    res.status(201).json({
      message: 'Event created successfully',
      event: populatedEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error during event creation' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validateEvent, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verify activity exists if being changed
    if (req.body.activity) {
      const activity = await Activity.findById(req.body.activity);
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('activity', 'name category type')
     .populate('organizer', 'name email')
     .populate('attendees.user', 'name email studentId');

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error during event update' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error during event deletion' });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for event
// @access  Private
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if registration is required
    if (event.requirements.registrationRequired) {
      // Check registration deadline
      if (event.requirements.registrationDeadline && 
          new Date() > event.requirements.registrationDeadline) {
        return res.status(400).json({ message: 'Registration deadline has passed' });
      }
    }

    // Check if user is already registered
    const existingRegistration = event.attendees.find(
      attendee => attendee.user.toString() === req.user._id.toString()
    );

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Register user
    await event.registerUser(req.user._id);

    // Send notification to user
    await req.user.addNotification(
      'Event Registration Confirmed',
      `You have successfully registered for "${event.title}" on ${event.date.toDateString()}`,
      'success'
    );

    const updatedEvent = await Event.findById(event._id)
      .populate('activity', 'name category type')
      .populate('organizer', 'name email')
      .populate('attendees.user', 'name email studentId');

    res.json({
      message: 'Successfully registered for event',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Event registration error:', error);
    if (error.message.includes('already registered') || 
        error.message.includes('at capacity') ||
        error.message.includes('deadline has passed')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during event registration' });
  }
});

// @route   DELETE /api/events/:id/unregister
// @desc    Unregister from event
// @access  Private
router.delete('/:id/unregister', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Unregister user
    await event.unregisterUser(req.user._id);

    // Send notification to user
    await req.user.addNotification(
      'Event Registration Cancelled',
      `You have cancelled your registration for "${event.title}"`,
      'info'
    );

    const updatedEvent = await Event.findById(event._id)
      .populate('activity', 'name category type')
      .populate('organizer', 'name email')
      .populate('attendees.user', 'name email studentId');

    res.json({
      message: 'Successfully unregistered from event',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Event unregistration error:', error);
    res.status(500).json({ message: 'Server error during event unregistration' });
  }
});

// @route   GET /api/events/:id/attendees
// @desc    Get event attendees
// @access  Private (Admin only)
router.get('/:id/attendees', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate({
        path: 'attendees.user',
        select: 'name email studentId grade phone profilePicture'
      });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ attendees: event.attendees });
  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id/attendance/:userId
// @desc    Mark attendance for user
// @access  Private (Admin only)
router.put('/:id/attendance/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['registered', 'present', 'absent', 'excused'].includes(status)) {
      return res.status(400).json({ message: 'Invalid attendance status' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.markAttendance(req.params.userId, status, notes);

    const updatedEvent = await Event.findById(event._id)
      .populate('attendees.user', 'name email studentId');

    res.json({
      message: 'Attendance marked successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    if (error.message.includes('not registered')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/meta/upcoming', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      status: 'scheduled'
    })
      .populate('activity', 'name category')
      .populate('organizer', 'name')
      .sort({ date: 1, startTime: 1 })
      .limit(parseInt(limit));

    res.json({ events: upcomingEvents });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
