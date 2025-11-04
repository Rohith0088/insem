const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['meeting', 'practice', 'competition', 'social', 'fundraiser', 'workshop', 'other']
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    default: null
  },
  requirements: {
    registrationRequired: {
      type: Boolean,
      default: false
    },
    registrationDeadline: {
      type: Date
    },
    dressCode: {
      type: String
    },
    equipment: [{
      type: String
    }],
    cost: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled', 'postponed'],
    default: 'scheduled'
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attendance: {
      type: String,
      enum: ['registered', 'present', 'absent', 'excused'],
      default: 'registered'
    },
    notes: {
      type: String
    }
  }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  reminders: [{
    type: {
      type: String,
      enum: ['email', 'sms', 'push'],
      default: 'email'
    },
    sendAt: {
      type: Date,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual for attendee count
eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees ? this.attendees.length : 0;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.capacity) return null;
  return Math.max(0, this.capacity - this.attendeeCount);
});

// Method to register user for event
eventSchema.methods.registerUser = function(userId) {
  const existingRegistration = this.attendees.find(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (existingRegistration) {
    throw new Error('User already registered for this event');
  }
  
  if (this.capacity && this.attendeeCount >= this.capacity) {
    throw new Error('Event is at capacity');
  }
  
  this.attendees.push({
    user: userId,
    registeredAt: new Date(),
    attendance: 'registered'
  });
  
  return this.save();
};

// Method to unregister user from event
eventSchema.methods.unregisterUser = function(userId) {
  this.attendees = this.attendees.filter(
    attendee => attendee.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to mark attendance
eventSchema.methods.markAttendance = function(userId, status, notes = '') {
  const attendee = this.attendees.find(
    attendee => attendee.user.toString() === userId.toString()
  );
  
  if (attendee) {
    attendee.attendance = status;
    attendee.notes = notes;
    return this.save();
  }
  
  throw new Error('User not registered for this event');
};

module.exports = mongoose.model('Event', eventSchema);
