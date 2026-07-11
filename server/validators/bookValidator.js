const { body } = require('express-validator');
const mongoose = require('mongoose');

exports.addBookRules = [
  body('title')
    .notEmpty()
    .withMessage('Book title is required')
    .trim(),
  body('author')
    .notEmpty()
    .withMessage('Author name is required')
    .trim(),
  body('ISBN')
    .notEmpty()
    .withMessage('ISBN is required')
    .trim(),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid Category ID');
      }
      return true;
    }),
  body('description')
    .notEmpty()
    .withMessage('Book description is required')
    .trim(),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(val => val >= 0)
    .withMessage('Price cannot be negative'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

exports.updateBookRules = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Book title cannot be empty')
    .trim(),
  body('author')
    .optional()
    .notEmpty()
    .withMessage('Author name cannot be empty')
    .trim(),
  body('ISBN')
    .optional()
    .notEmpty()
    .withMessage('ISBN cannot be empty')
    .trim(),
  body('category')
    .optional()
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid Category ID');
      }
      return true;
    }),
  body('description')
    .optional()
    .notEmpty()
    .withMessage('Book description cannot be empty')
    .trim(),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .custom(val => val >= 0)
    .withMessage('Price cannot be negative'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];
