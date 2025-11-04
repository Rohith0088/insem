const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['club', 'sport', 'academic', 'volunteer', 'cultural', 'other']
  },
  type: {
    type: String,
    required: true,
    enum: ['ongoing', 'event', 'competition']
  },
  supervisor: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    }
  },
  schedule: {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'TBD']
    },
    time: {
      type: String
    },
    location: {
      type: String
    },
    frequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly', 'as-needed']
    }
  },
  requirements: {
    gradeLevel: [{
      type: String,
      enum: ['9', '10', '11', '12', 'undergraduate', 'graduate', 'all']
    }],
    maxParticipants: {
      type: Number,
      default: null
    },
    prerequisites: [{
      type: String
    }],
    equipment: [{
      type: String
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'full'],
    default: 'active'
  },
  image: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  statistics: {
    totalRegistrations: {
      type: Number,
      default: 0
    },
    activeParticipants: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Virtual for participant count
activitySchema.virtual('participantCount').get(function() {
  return this.participants ? this.participants.length : 0;
});

// Method to add participant
activitySchema.methods.addParticipant = function(userId) {
  if (!this.participants.includes(userId)) {
    this.participants.push(userId);
    this.statistics.totalRegistrations += 1;
    this.statistics.activeParticipants = this.participants.length;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove participant
activitySchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(id => id.toString() !== userId.toString());
  this.statistics.activeParticipants = this.participants.length;
  return this.save();
};

module.exports = mongoose.model('Activity', activitySchema);
