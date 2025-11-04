const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true // Allows null values but ensures uniqueness when present
  },
  grade: {
    type: String,
    enum: ['9', '10', '11', '12', 'undergraduate', 'graduate']
  },
  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notifications: [{
    title: String,
    message: String,
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error']
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add notification method
userSchema.methods.addNotification = function(title, message, type = 'info') {
  this.notifications.push({
    title,
    message,
    type,
    isRead: false
  });
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
