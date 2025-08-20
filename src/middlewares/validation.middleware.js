const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.validateProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isInt({ gt: 0 }).withMessage('Price must be a positive integer'),
  body('tags').isArray().withMessage('Tags must be an array'),
  handleValidationErrors,
];

exports.validateArticle = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  handleValidationErrors,
];

exports.validateComment = [
  body('content').notEmpty().withMessage('Content is required'),
  handleValidationErrors,
];
