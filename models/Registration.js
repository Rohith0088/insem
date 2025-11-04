const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  notes: {
    type: String
  },
  attendance: {
    totalEvents: {
      type: Number,
      default: 0
    },
    attendedEvents: {
      type: Number,
      default: 0
    },
    attendanceRate: {
      type: Number,
      default: 0
    }
  },
  achievements: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    },
    awardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  performance: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Compound index to ensure unique user-activity combinations
registrationSchema.index({ user: 1, activity: 1 }, { unique: true });

// Method to approve registration
registrationSchema.methods.approve = function(adminId, notes = '') {
  this.status = 'approved';
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  this.notes = notes;
  return this.save();
};

// Method to reject registration
registrationSchema.methods.reject = function(adminId, reason) {
  this.status = 'rejected';
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
};

// Method to update attendance
registrationSchema.methods.updateAttendance = function(totalEvents, attendedEvents) {
  this.attendance.totalEvents = totalEvents;
  this.attendance.attendedEvents = attendedEvents;
  this.attendance.attendanceRate = totalEvents > 0 ? (attendedEvents / totalEvents) * 100 : 0;
  return this.save();
};

// Method to add achievement
registrationSchema.methods.addAchievement = function(title, description, awardedBy) {
  this.achievements.push({
    title,
    description,
    date: new Date(),
    awardedBy
  });
  return this.save();
};

// Method to update performance
registrationSchema.methods.updatePerformance = function(rating, feedback) {
  this.performance.rating = rating;
  this.performance.feedback = feedback;
  this.performance.lastUpdated = new Date();
  return this.save();
};

module.exports = mongoose.model('Registration', registrationSchema);
