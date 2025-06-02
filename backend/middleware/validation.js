// middleware/validation.js
const { body, validationResult } = require("express-validator");

exports.validateAuth = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => e.msg),
      });
    }
    next();
  },
];

exports.validatePost = [
  body('title').exists().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('content').exists().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => e.msg),
      });
    }
    next();
  }
];