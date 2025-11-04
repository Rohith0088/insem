const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['student', 'admin'])
    .withMessage('Role must be either student or admin'),
  body('studentId')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Student ID must be between 3 and 20 characters'),
  body('grade')
    .optional()
    .isIn(['9', '10', '11', '12', 'undergraduate', 'graduate'])
    .withMessage('Invalid grade level'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Activity validation
const validateActivity = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Activity name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['club', 'sport', 'academic', 'volunteer', 'cultural', 'other'])
    .withMessage('Invalid activity category'),
  body('type')
    .isIn(['ongoing', 'event', 'competition'])
    .withMessage('Invalid activity type'),
  body('supervisor.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Supervisor name must be between 2 and 50 characters'),
  body('supervisor.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Supervisor email must be valid'),
  handleValidationErrors
];

// Event validation
const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Event title must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('activity')
    .isMongoId()
    .withMessage('Valid activity ID is required'),
  body('type')
    .isIn(['meeting', 'practice', 'competition', 'social', 'fundraiser', 'workshop', 'other'])
    .withMessage('Invalid event type'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Location must be between 2 and 200 characters'),
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters'),
  body('grade')
    .optional()
    .isIn(['9', '10', '11', '12', 'undergraduate', 'graduate'])
    .withMessage('Invalid grade level'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateActivity,
  validateEvent,
  validateProfileUpdate
};
