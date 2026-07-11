const { body } = require('express-validator');

exports.registerRules = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  body('role')
    .optional()
    .isIn(['Customer', 'Seller', 'Admin'])
    .withMessage('Invalid role choice')
];

exports.loginRules = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

exports.profileRules = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .trim(),
  body('phone')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim()
];
