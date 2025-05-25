const { param, body, validationResult } = require("express-validator");

exports.validateUserId = [
  param("userId")
    .exists().withMessage("userId is required")
    .isInt({ gt: 0 }).withMessage("userId must be a positive integer"),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array().map(e=>e.msg) });
    // Ownership check
    if (req.user.userId !== parseInt(req.params.userId, 10)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
];

exports.validatePlanId = [
  body("planId")
    .exists().withMessage("planId is required")
    .isInt({ gt: 0 }).withMessage("planId must be a positive integer"),
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array().map(e=>e.msg) });
    next();
  }
];

exports.validateAuthRegister = [
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
  body("name")
    .exists()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string"),
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
